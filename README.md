# Sumary

This project is my pet project, demonstrate a small piece of E-comerce System. I made this to practice Serverless and System Design techniqe. For simplicity, I just implement some flows in client side, assume that the products are already available.

## Tech Stack:

- AWS Lambda Function

- AWS RDS (Postgres), AWS RDS Proxy, AWS DocumentDB (MongoDB), AWS Keyspaces (Cassandra)
- AWS Cognito
- AWS API Gateway
- AWS Networking (VPC, subnets, security groups, NAT gateway,...)
- AWS SNS, SQS
- AWS S3
- Terraform

## Techniques:

- Clean Architecture
- Dependency Inversion Principle
- Repository Pattern
- Serverless
- Infrastructure as Code

# Design

## 1. High level design

![High Level Design](ecom-high-level-design.jpg 'High Level Design')

Client will authenticate with Cognito and receive the id token as JWT, then use the JWT call to API Gateway. API Gateway after that will verify the token with Cognito, if valid, the request will be directed to the suitable routes.

For simplicity, I just design some services, and each service is a collection of AWS Lambda Functions.

- Product Service: Manage the product's logic, for client to get all products, get detail product.
- Inventory Service: Manage product's inventory status, allow get/increase/decrease product's quantity. This service only allow internal calls from other services, not allow public call from client.
- Order Service: Manage order flows.
- Payment Service: Manage payment status, notify for other services when a new payment is created. (using Fanout Pattern)
- Invoice Service: If the payment is success, this service will generate an invoice as PDF file, and store in S3.
- Notification Service: After storing PDF invoice, S3 will trigger notification service to send email for client, with the PDF invoice attached.

## 2. Database Decision

- Product Service: Since we have many types of product, and each type has different attributes, for example: a shirt has size, color, fabric attributes, while a television has screen size, brand name, resolution, scan frequency,... So, a NoSQL document-oriented database with flexible schema like MongoDB/AWS DocumentDB is very suitable to storage Product's information.
- Inventory Service: Since we need a strict consistency for product's quantity, so we need a Relational Database for this service.
- Payment Service: a Relational Database, of course
- Order Service: The new orders or processing orders will be stored in a Relational Database for tracking and updating status. After the order is delivered successfully, it will be moved to Cassandra for long term storage, since we don't need to update the delivered orders, we just read them, so we don't need the consistency anymore.
- Invoice Service: For simplicity, I don't store the Invoice information in this project. I just use S3 to store the PDF invoices. But if you want, you can use MongoDB, because again, the invoice's information is read-only, and the nested array in MongoDB is very helpful, we don't need to join tables to get invoice with details.

Beside that, in a real product, we may use more Databases, like Redis for caching, Elasticsearch for full text searching, and we also can use Cassandra to store the suggested products.

## 3. API Design

### Get list Products

![List Products Flow](list-products.jpg 'List Products Flow')

1. Client do authentication with Cognito, receive the id token and use it to call API to API Gateway.
2. Client use id token call to API Gateway
3. API Gateway verify the token with Cognito to double check
4. API Gateway route the request to list products Lambda function
5. Lambda function query to Product DocumentDB
6. Return response to API Gateway
7. Return response to Client

### Get detail Product

![Detail Product Flow](detail-product.jpg 'Detail Product Flow')

1, 2, 3. Authentication flow, same with above. 4. API Gateway route the request to Detail Product Lambda function 5. Lambda function query product with provided id 6. If product exists, Detail Product Lambda function call to Get Inventory By Product Lambda function to get product's quantity 7. Get Inventory By Product Lambda function query RDS DB, via RDS Proxy, and return to Lambda function 8. Return response to Detail Product Lambda function 9. Return response to API Gateway 10. Return response to Client

### Create Order

![Create Order Flow](create-order.jpg 'Create Order Flow')

1, 2, 3. Authentication flow, same with above. 4. API Gateway route the request to Create Order Lambda function 5. Create Order Lambda function create a new Order and save to RDS, via RDS Proxy 6. Create Order Lambda function call to Update Inventory Lambda function to decrease Product's quantity 7. Update Inventory Lambda function update Product's quantity to RDS DB, via RDS Proxy, and return to Lambda function 8. Return response to Create Order Lambda function 9. Return response to API Gateway 10. Return response to Client 11. Client use the Order's information do payment process with 3rd party Payment Service 12. 3rd party Payment Service hook to API Gateway to notify about payment status 13. API Gateway route the hook request to Create Payment Lambda function 14. Create Payment Lambda function save the payment info to RDS, via RDS Proxy 15. Create Payment Lambda function send the created payment to SNS topic `cdc-payment-created` 16. Inventory Service, Order Service, Invoice Service are subscribing to `cdc-payment-created` topic, each particular service will handle the payment created event in different ways:

- **Inventory Service**: If the created payment is success, do nothing. Otherwise, increase the Product's quantity that we have decreased in step 6, 7.
- **Order Service**: If the created payment is success, update the order's status to `delivering`. Otherwise, update the status to `canceled` with a reason payment failed.
- **Invoice Service**: If the created payment is failed, do nothing. Otherwise, use the order's information to generate PDF Invoice.

17. Invoice Service store the generated PDF invoice to S3 bucket
18. Invoice bucket on object created event will trigger Notification Service
19. Notification Service downloads the generated PDF invoice and call to 3rd party Email Service
20. 3rd party Email Service send email invoice for Client with PDF invoice as attachment.
