# 🎓 Microservices Learning Guide

## 📚 **Table of Contents**
1. [Microservices Fundamentals](#microservices-fundamentals)
2. [Architecture Patterns](#architecture-patterns)
3. [Communication Patterns](#communication-patterns)
4. [Data Management](#data-management)
5. [Service Discovery & Load Balancing](#service-discovery--load-balancing)
6. [API Design](#api-design)
7. [Error Handling & Resilience](#error-handling--resilience)
8. [Monitoring & Observability](#monitoring--observability)
9. [Security](#security)
10. [Testing Strategies](#testing-strategies)
11. [Deployment & DevOps](#deployment--devops)
12. [Performance & Scaling](#performance--scaling)
13. [Best Practices](#best-practices)
14. [Common Anti-Patterns](#common-anti-patterns)
15. [Tools & Technologies](#tools--technologies)

---

## 🏗️ **Microservices Fundamentals**

### **What are Microservices?**
Microservices is an architectural style where an application is built as a collection of small, independent services that communicate over well-defined APIs.

### **Key Characteristics:**
- **Single Responsibility**: Each service does one thing well
- **Independent Deployment**: Services can be deployed separately
- **Technology Diversity**: Each service can use different technologies
- **Data Isolation**: Each service manages its own data
- **Fault Isolation**: Failure in one service doesn't break others

### **Benefits:**
✅ **Scalability**: Scale individual services based on demand  
✅ **Maintainability**: Easier to understand and modify small services  
✅ **Technology Flexibility**: Use best tool for each service  
✅ **Team Autonomy**: Teams can work independently  
✅ **Fault Tolerance**: Isolated failures  

### **Challenges:**
⚠️ **Complexity**: More moving parts to manage  
⚠️ **Network Latency**: Communication overhead between services  
⚠️ **Data Consistency**: Harder to maintain consistency across services  
⚠️ **Testing**: More complex integration testing  
⚠️ **Monitoring**: Need to track requests across multiple services  

---

## 🏛️ **Architecture Patterns**

### **1. Event-Driven Architecture**
```javascript
// Service publishes events
await eventBus.publish('ORDER_CREATED', {
  orderId: 123,
  customerId: 456,
  totalAmount: 99.99
});

// Other services consume events
eventBus.subscribe('ORDER_CREATED', async (event) => {
  await updateInventory(event.orderId);
  await notifyCustomer(event.customerId);
});
```

**When to Use:**
- Loose coupling between services
- Asynchronous processing
- Complex workflows
- Real-time updates

### **2. API Gateway Pattern**
```javascript
// API Gateway routes requests to appropriate services
app.get('/api/orders/:id', async (req, res) => {
  const order = await orderService.getOrder(req.params.id);
  const customer = await customerService.getCustomer(order.customerId);
  const restaurant = await restaurantService.getRestaurant(order.restaurantId);
  
  res.json({
    order,
    customer,
    restaurant
  });
});
```

**Benefits:**
- Single entry point for clients
- Authentication/Authorization
- Rate limiting
- Request/Response transformation

### **3. Saga Pattern (Distributed Transactions)**
```javascript
// Saga for order processing
const saga = new Saga([
  {
    name: 'validate-order',
    action: () => orderService.validate(order),
    compensation: () => orderService.cancel(order)
  },
  {
    name: 'process-payment',
    action: () => paymentService.process(order),
    compensation: () => paymentService.refund(order)
  },
  {
    name: 'update-inventory',
    action: () => inventoryService.update(order),
    compensation: () => inventoryService.restore(order)
  }
]);

await saga.execute();
```

**Use Cases:**
- Distributed transactions
- Complex business workflows
- Compensation logic needed

### **4. CQRS (Command Query Responsibility Segregation)**
```javascript
// Command side (writes)
class CreateOrderCommand {
  async execute(orderData) {
    const order = await orderRepository.create(orderData);
    await eventBus.publish('ORDER_CREATED', order);
    return order;
  }
}

// Query side (reads)
class OrderQueryService {
  async getOrderWithDetails(orderId) {
    return await orderReadModel.getOrderWithDetails(orderId);
  }
}
```

**Benefits:**
- Optimize read and write operations separately
- Scale reads and writes independently
- Complex query support

---

## 📡 **Communication Patterns**

### **1. Synchronous Communication (HTTP/REST)**
```javascript
// Service-to-service HTTP calls
async function getOrderWithRestaurant(orderId) {
  const order = await orderService.getOrder(orderId);
  const restaurant = await fetch(`${RESTAURANT_SERVICE_URL}/api/restaurants/${order.restaurantId}`);
  return { ...order, restaurant: await restaurant.json() };
}
```

**Use Cases:**
- Real-time data needs
- Request-response patterns
- Simple queries

### **2. Asynchronous Communication (Message Queues)**
```javascript
// Publisher
await rabbitMQ.publish('order_events', {
  type: 'ORDER_CREATED',
  data: { orderId: 123, customerId: 456 }
});

// Consumer
await rabbitMQ.subscribe('order_events', async (message) => {
  if (message.type === 'ORDER_CREATED') {
    await notificationService.sendOrderConfirmation(message.data);
  }
});
```

**Use Cases:**
- Event-driven architecture
- Background processing
- Decoupled services

### **3. gRPC Communication**
```javascript
// Protocol Buffers definition
message Order {
  int32 id = 1;
  string customer_name = 2;
  double total_amount = 3;
}

// Service definition
service OrderService {
  rpc GetOrder(OrderRequest) returns (Order);
  rpc CreateOrder(CreateOrderRequest) returns (Order);
}
```

**Benefits:**
- High performance
- Strong typing
- Bidirectional streaming

---

## 💾 **Data Management**

### **1. Database per Service**
```javascript
// Each service has its own database
// Restaurant Service
const restaurantDB = new PrismaClient({
  datasources: { db: { url: process.env.RESTAURANT_DB_URL } }
});

// Order Service
const orderDB = new PrismaClient({
  datasources: { db: { url: process.env.ORDER_DB_URL } }
});
```

**Benefits:**
- Data isolation
- Independent scaling
- Technology flexibility

### **2. Shared Database (Anti-pattern but sometimes necessary)**
```javascript
// Multiple services share same database
// Use schema separation
const restaurantSchema = 'restaurant_service';
const orderSchema = 'order_service';

// Restaurant Service
const restaurant = await prisma.$queryRaw`
  SELECT * FROM ${restaurantSchema}.restaurants WHERE id = ${restaurantId}
`;
```

### **3. Event Sourcing**
```javascript
// Store events instead of state
class OrderEventStore {
  async appendEvents(orderId, events) {
    for (const event of events) {
      await this.store.append(orderId, event);
    }
  }
  
  async getOrder(orderId) {
    const events = await this.store.getEvents(orderId);
    return this.rebuildOrder(events);
  }
}
```

**Benefits:**
- Complete audit trail
- Temporal queries
- Event replay capability

### **4. CQRS with Event Sourcing**
```javascript
// Write side - Command handlers
class CreateOrderCommandHandler {
  async handle(command) {
    const order = Order.create(command);
    const events = order.getUncommittedEvents();
    await eventStore.appendEvents(order.id, events);
    await eventBus.publish(events);
  }
}

// Read side - Projections
class OrderProjection {
  async handle(event) {
    if (event.type === 'ORDER_CREATED') {
      await readModel.create({
        id: event.orderId,
        customerId: event.customerId,
        status: 'created'
      });
    }
  }
}
```

---

## 🔍 **Service Discovery & Load Balancing**

### **1. Service Registry**
```javascript
// Service registers itself
class ServiceRegistry {
  async register(serviceName, serviceUrl, healthCheck) {
    await this.registry.set(serviceName, {
      url: serviceUrl,
      healthCheck,
      lastHeartbeat: Date.now()
    });
  }
  
  async discover(serviceName) {
    const service = await this.registry.get(serviceName);
    if (!service || !this.isHealthy(service)) {
      throw new Error(`Service ${serviceName} not available`);
    }
    return service.url;
  }
}
```

### **2. Load Balancing**
```javascript
// Round-robin load balancer
class LoadBalancer {
  constructor(services) {
    this.services = services;
    this.currentIndex = 0;
  }
  
  getNextService() {
    const service = this.services[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.services.length;
    return service;
  }
}

// Usage
const loadBalancer = new LoadBalancer([
  'http://order-service-1:3001',
  'http://order-service-2:3001',
  'http://order-service-3:3001'
]);
```

### **3. Health Checks**
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    service: 'order-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dependencies: {
      database: await checkDatabase(),
      rabbitmq: await checkRabbitMQ(),
      redis: await checkRedis()
    }
  };
  
  const isHealthy = health.dependencies.database && 
                   health.dependencies.rabbitmq && 
                   health.dependencies.redis;
  
  res.status(isHealthy ? 200 : 503).json(health);
});
```

---

## 🎨 **API Design**

### **1. RESTful API Design**
```javascript
// Resource-based URLs
GET    /api/restaurants              // List restaurants
POST   /api/restaurants              // Create restaurant
GET    /api/restaurants/:id          // Get restaurant
PUT    /api/restaurants/:id          // Update restaurant
DELETE /api/restaurants/:id          // Delete restaurant

// Nested resources
GET    /api/restaurants/:id/menu     // Get restaurant menu
POST   /api/restaurants/:id/orders   // Create order for restaurant
GET    /api/restaurants/:id/orders   // Get restaurant orders
```

### **2. API Versioning**
```javascript
// URL versioning
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Header versioning
app.use((req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
});
```

### **3. API Documentation (OpenAPI/Swagger)**
```javascript
// Swagger documentation
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               items:
 *                 type: array
 *     responses:
 *       201:
 *         description: Order created successfully
 */
app.post('/api/orders', createOrder);
```

### **4. API Rate Limiting**
```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

---

## 🚨 **Error Handling & Resilience**

### **1. Circuit Breaker Pattern**
```javascript
class CircuitBreaker {
  constructor(failureThreshold = 5, timeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.timeout = timeout;
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async call(serviceCall) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await serviceCall();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
```

### **2. Retry Pattern**
```javascript
async function retryWithExponentialBackoff(operation, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
    }
  }
}
```

### **3. Bulkhead Pattern**
```javascript
// Separate thread pools for different operations
const orderThreadPool = new WorkerThreads.WorkerPool(10);
const paymentThreadPool = new WorkerThreads.WorkerPool(5);
const notificationThreadPool = new WorkerThreads.WorkerPool(3);

// Use specific thread pool for each operation
async function processOrder(orderData) {
  return await orderThreadPool.execute(() => orderService.process(orderData));
}

async function processPayment(paymentData) {
  return await paymentThreadPool.execute(() => paymentService.process(paymentData));
}
```

### **4. Timeout Pattern**
```javascript
async function callWithTimeout(serviceCall, timeoutMs = 5000) {
  return Promise.race([
    serviceCall(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
}
```

---

## 📊 **Monitoring & Observability**

### **1. Logging**
```javascript
// Structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'order-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Order created', {
  orderId: 123,
  customerId: 456,
  amount: 99.99,
  correlationId: req.correlationId
});
```

### **2. Metrics Collection**
```javascript
// Prometheus metrics
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});
```

### **3. Distributed Tracing**
```javascript
// Jaeger tracing
const { initTracer } = require('jaeger-client');

const tracer = initTracer({
  serviceName: 'order-service',
  sampler: { type: 'const', param: 1 }
});

// Trace service calls
async function createOrder(orderData) {
  const span = tracer.startSpan('create-order');
  
  try {
    span.setTag('customer.id', orderData.customerId);
    span.setTag('order.amount', orderData.totalAmount);
    
    const order = await orderRepository.create(orderData);
    
    span.setTag('order.id', order.id);
    span.finish();
    
    return order;
  } catch (error) {
    span.setTag('error', true);
    span.log({ event: 'error', 'error.object': error });
    span.finish();
    throw error;
  }
}
```

### **4. Health Checks**
```javascript
// Comprehensive health check
app.get('/health', async (req, res) => {
  const health = {
    service: 'order-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    dependencies: {
      database: await checkDatabase(),
      rabbitmq: await checkRabbitMQ(),
      redis: await checkRedis()
    },
    resources: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  };
  
  const isHealthy = Object.values(health.dependencies).every(dep => dep.status === 'healthy');
  
  res.status(isHealthy ? 200 : 503).json(health);
});
```

---

## 🔒 **Security**

### **1. Authentication & Authorization**
```javascript
// JWT Authentication
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### **2. API Security**
```javascript
// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Helmet for security headers
app.use(helmet());

// Input validation
const { body, validationResult } = require('express-validator');

const validateOrder = [
  body('customerId').isInt().withMessage('Customer ID must be an integer'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.menuItemId').isInt().withMessage('Menu item ID must be an integer'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

### **3. Service-to-Service Security**
```javascript
// API Key authentication for service-to-service calls
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Mutual TLS for service communication
const https = require('https');
const fs = require('fs');

const agent = new https.Agent({
  cert: fs.readFileSync('client-cert.pem'),
  key: fs.readFileSync('client-key.pem'),
  ca: fs.readFileSync('ca-cert.pem')
});

const response = await fetch('https://order-service:3001/api/orders', {
  agent
});
```

---

## 🧪 **Testing Strategies**

### **1. Unit Testing**
```javascript
// Jest unit tests
describe('OrderService', () => {
  let orderService;
  let mockOrderRepository;
  
  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn()
    };
    orderService = new OrderService(mockOrderRepository);
  });
  
  test('should create order successfully', async () => {
    const orderData = { customerId: 1, items: [] };
    const expectedOrder = { id: 1, ...orderData };
    
    mockOrderRepository.create.mockResolvedValue(expectedOrder);
    
    const result = await orderService.createOrder(orderData);
    
    expect(result).toEqual(expectedOrder);
    expect(mockOrderRepository.create).toHaveBeenCalledWith(orderData);
  });
});
```

### **2. Integration Testing**
```javascript
// Integration tests with test database
describe('Order API Integration', () => {
  let app;
  let testDb;
  
  beforeAll(async () => {
    testDb = await setupTestDatabase();
    app = createApp(testDb);
  });
  
  afterAll(async () => {
    await testDb.destroy();
  });
  
  test('should create order via API', async () => {
    const orderData = {
      customerId: 1,
      items: [{ menuItemId: 1, quantity: 2 }]
    };
    
    const response = await request(app)
      .post('/api/orders')
      .send(orderData)
      .expect(201);
    
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.customerId).toBe(orderData.customerId);
  });
});
```

### **3. Contract Testing (Pact)**
```javascript
// Consumer contract test
describe('Order Service Consumer', () => {
  const provider = new Pact({
    consumer: 'restaurant-service',
    provider: 'order-service'
  });
  
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  
  test('should get orders for restaurant', async () => {
    await provider.addInteraction({
      state: 'restaurant has orders',
      uponReceiving: 'a request for restaurant orders',
      withRequest: {
        method: 'GET',
        path: '/api/orders/restaurant/1'
      },
      willRespondWith: {
        status: 200,
        body: {
          orders: [
            { id: 1, customerId: 1, totalAmount: 25.99 }
          ]
        }
      }
    });
    
    const response = await fetch(`${provider.mockService.baseUrl}/api/orders/restaurant/1`);
    const data = await response.json();
    
    expect(data.orders).toHaveLength(1);
    expect(data.orders[0].id).toBe(1);
  });
});
```

### **4. End-to-End Testing**
```javascript
// E2E test with multiple services
describe('Complete Order Flow', () => {
  test('customer should be able to place and pay for order', async () => {
    // 1. Create restaurant
    const restaurant = await createRestaurant({
      name: 'Test Restaurant',
      menu: [{ name: 'Pizza', price: 15.99 }]
    });
    
    // 2. Create customer
    const customer = await createCustomer({
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    // 3. Place order
    const order = await placeOrder({
      restaurantId: restaurant.id,
      customerId: customer.id,
      items: [{ menuItemId: 1, quantity: 1 }]
    });
    
    // 4. Process payment
    const payment = await processPayment({
      orderId: order.id,
      amount: order.totalAmount,
      method: 'credit_card'
    });
    
    // 5. Verify order status
    const updatedOrder = await getOrder(order.id);
    expect(updatedOrder.status).toBe('paid');
    
    // 6. Verify restaurant received notification
    const restaurantOrders = await getRestaurantOrders(restaurant.id);
    expect(restaurantOrders).toContainEqual(
      expect.objectContaining({ id: order.id, status: 'paid' })
    );
  });
});
```

---

## 🚀 **Deployment & DevOps**

### **1. Containerization (Docker)**
```dockerfile
# Dockerfile for Order Service
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]
```

### **2. Orchestration (Kubernetes)**
```yaml
# order-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
      - name: order-service
        image: restofy/order-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: RABBITMQ_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: rabbitmq-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

### **3. CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy Microservices

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Run integration tests
      run: npm run test:integration
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker images
      run: |
        docker build -t restofy/order-service:${{ github.sha }} ./order-service
        docker build -t restofy/restaurant-service:${{ github.sha }} ./restaurant-service
        docker build -t restofy/payment-service:${{ github.sha }} ./payment-service
        
    - name: Push to registry
      run: |
        docker push restofy/order-service:${{ github.sha }}
        docker push restofy/restaurant-service:${{ github.sha }}
        docker push restofy/payment-service:${{ github.sha }}
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/order-service order-service=restofy/order-service:${{ github.sha }}
        kubectl set image deployment/restaurant-service restaurant-service=restofy/restaurant-service:${{ github.sha }}
        kubectl set image deployment/payment-service payment-service=restofy/payment-service:${{ github.sha }}
```

### **4. Infrastructure as Code (Terraform)**
```hcl
# main.tf
provider "aws" {
  region = "us-west-2"
}

# EKS Cluster
resource "aws_eks_cluster" "restofy" {
  name     = "restofy-cluster"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = "1.24"

  vpc_config {
    subnet_ids = var.subnet_ids
  }
}

# RDS Database
resource "aws_db_instance" "restofy_db" {
  identifier        = "restofy-db"
  engine            = "postgres"
  engine_version    = "13.7"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "restofy"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.restofy.name
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "restofy_redis" {
  cluster_id           = "restofy-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  port                 = 6379
}
```

---

## ⚡ **Performance & Scaling**

### **1. Horizontal Scaling**
```javascript
// Load balancer configuration
const loadBalancer = {
  algorithm: 'round-robin',
  healthCheck: {
    path: '/health',
    interval: 30,
    timeout: 5,
    unhealthyThreshold: 3,
    healthyThreshold: 2
  },
  instances: [
    'http://order-service-1:3001',
    'http://order-service-2:3001',
    'http://order-service-3:3001'
  ]
};
```

### **2. Caching Strategies**
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

class OrderCache {
  async getOrder(orderId) {
    const cached = await client.get(`order:${orderId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const order = await orderRepository.findById(orderId);
    await client.setex(`order:${orderId}`, 300, JSON.stringify(order)); // 5 minutes
    return order;
  }
  
  async invalidateOrder(orderId) {
    await client.del(`order:${orderId}`);
  }
}
```

### **3. Database Optimization**
```javascript
// Connection pooling
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // maximum number of clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Query optimization
const getOrdersWithOptimization = async (restaurantId) => {
  const query = `
    SELECT o.*, 
           json_agg(oi.*) as items,
           c.name as customer_name
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.restaurant_id = $1
    GROUP BY o.id, c.name
    ORDER BY o.created_at DESC
  `;
  
  return await pool.query(query, [restaurantId]);
};
```

### **4. Async Processing**
```javascript
// Background job processing
const Queue = require('bull');

const orderQueue = new Queue('order-processing', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

// Add job to queue
await orderQueue.add('process-order', {
  orderId: 123,
  customerId: 456,
  items: [...]
}, {
  priority: 1,
  delay: 5000, // 5 seconds delay
  attempts: 3
});

// Process jobs
orderQueue.process('process-order', async (job) => {
  const { orderId, customerId, items } = job.data;
  
  // Process order asynchronously
  await processOrderItems(items);
  await updateInventory(items);
  await sendNotifications(customerId, orderId);
  
  return { status: 'completed', orderId };
});
```

---

## ✅ **Best Practices**

### **1. Service Design**
- **Single Responsibility**: Each service should do one thing well
- **Loose Coupling**: Services should be independent
- **High Cohesion**: Related functionality should be together
- **API-First Design**: Design APIs before implementation

### **2. Data Management**
- **Database per Service**: Each service owns its data
- **Eventual Consistency**: Accept temporary inconsistencies
- **CQRS**: Separate read and write models when needed
- **Event Sourcing**: Use events for audit trails

### **3. Communication**
- **Async by Default**: Use events for state changes
- **Sync When Needed**: Use HTTP for real-time data
- **Circuit Breakers**: Prevent cascade failures
- **Retry Logic**: Handle temporary failures

### **4. Monitoring**
- **Health Checks**: Monitor service health
- **Metrics**: Collect performance metrics
- **Logging**: Structured logging with correlation IDs
- **Tracing**: Track requests across services

### **5. Security**
- **Zero Trust**: Verify every request
- **API Security**: Use authentication and authorization
- **Data Encryption**: Encrypt data in transit and at rest
- **Secrets Management**: Secure configuration management

---

## ❌ **Common Anti-Patterns**

### **1. Distributed Monolith**
```javascript
// ❌ Bad: Services are tightly coupled
class OrderService {
  async createOrder(orderData) {
    // Direct database calls to other services
    const customer = await customerDb.findById(orderData.customerId);
    const restaurant = await restaurantDb.findById(orderData.restaurantId);
    const menu = await menuDb.findByRestaurant(orderData.restaurantId);
    
    // Business logic mixed with data access
    if (customer.status !== 'active') {
      throw new Error('Customer not active');
    }
    
    // Direct service calls
    await paymentService.validatePayment(orderData.payment);
    await inventoryService.updateStock(orderData.items);
  }
}

// ✅ Good: Services are loosely coupled
class OrderService {
  async createOrder(orderData) {
    // Validate order data
    await this.validateOrder(orderData);
    
    // Create order
    const order = await this.orderRepository.create(orderData);
    
    // Publish events for other services
    await this.eventBus.publish('ORDER_CREATED', {
      orderId: order.id,
      customerId: order.customerId,
      restaurantId: order.restaurantId
    });
    
    return order;
  }
}
```

### **2. Shared Database**
```javascript
// ❌ Bad: Multiple services share same database
const orderService = new PrismaClient({
  datasources: { db: { url: process.env.SHARED_DB_URL } }
});

const restaurantService = new PrismaClient({
  datasources: { db: { url: process.env.SHARED_DB_URL } }
});

// ✅ Good: Each service has its own database
const orderService = new PrismaClient({
  datasources: { db: { url: process.env.ORDER_DB_URL } }
});

const restaurantService = new PrismaClient({
  datasources: { db: { url: process.env.RESTAURANT_DB_URL } }
});
```

### **3. Synchronous Communication Everywhere**
```javascript
// ❌ Bad: Everything is synchronous
async function processOrder(orderData) {
  // Blocking calls to other services
  const customer = await customerService.getCustomer(orderData.customerId);
  const restaurant = await restaurantService.getRestaurant(orderData.restaurantId);
  const payment = await paymentService.processPayment(orderData.payment);
  const inventory = await inventoryService.updateStock(orderData.items);
  
  // If any service is slow, everything is slow
  return { customer, restaurant, payment, inventory };
}

// ✅ Good: Mix of sync and async
async function processOrder(orderData) {
  // Create order immediately
  const order = await orderRepository.create(orderData);
  
  // Publish events for async processing
  await eventBus.publish('ORDER_CREATED', {
    orderId: order.id,
    customerId: order.customerId,
    items: orderData.items
  });
  
  // Only sync calls for critical validation
  const payment = await paymentService.validatePayment(orderData.payment);
  
  return { order, payment };
}
```

### **4. No Error Handling**
```javascript
// ❌ Bad: No error handling
app.post('/api/orders', async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.json(order);
});

// ✅ Good: Proper error handling
app.post('/api/orders', async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    logger.error('Failed to create order', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid order data',
        details: error.details 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});
```

---

## 🛠️ **Tools & Technologies**

### **1. Message Brokers**
- **RabbitMQ**: Feature-rich message broker
- **Apache Kafka**: High-throughput distributed streaming
- **Redis Pub/Sub**: Simple pub/sub messaging
- **AWS SQS**: Managed message queuing

### **2. Service Discovery**
- **Consul**: Service discovery and configuration
- **Eureka**: Netflix service discovery
- **etcd**: Distributed key-value store
- **Kubernetes**: Built-in service discovery

### **3. API Gateways**
- **Kong**: API gateway and microservices management
- **AWS API Gateway**: Managed API gateway
- **Zuul**: Netflix API gateway
- **Traefik**: Modern reverse proxy

### **4. Monitoring & Observability**
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Jaeger**: Distributed tracing
- **ELK Stack**: Logging (Elasticsearch, Logstash, Kibana)

### **5. Testing Tools**
- **Jest**: Unit testing
- **Supertest**: API testing
- **Pact**: Contract testing
- **Cypress**: E2E testing

### **6. Deployment & Orchestration**
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **Helm**: Kubernetes package manager
- **Terraform**: Infrastructure as code

---

## 🎯 **Learning Path**

### **Beginner Level (1-3 months)**
1. **Understand Microservices Concepts**
   - Read "Building Microservices" by Sam Newman
   - Practice with simple examples
   - Understand service boundaries

2. **Learn Communication Patterns**
   - HTTP/REST APIs
   - Message queues (RabbitMQ)
   - Event-driven architecture

3. **Basic Service Implementation**
   - Create simple microservices
   - Implement basic APIs
   - Add health checks

### **Intermediate Level (3-6 months)**
1. **Advanced Patterns**
   - Saga pattern for distributed transactions
   - CQRS and Event Sourcing
   - Circuit breaker and retry patterns

2. **Data Management**
   - Database per service
   - Eventual consistency
   - Data synchronization strategies

3. **Monitoring & Observability**
   - Logging and metrics
   - Distributed tracing
   - Health monitoring

### **Advanced Level (6+ months)**
1. **Production Readiness**
   - Security implementation
   - Performance optimization
   - Scalability patterns

2. **DevOps & Deployment**
   - Containerization
   - Kubernetes orchestration
   - CI/CD pipelines

3. **Advanced Topics**
   - Service mesh (Istio)
   - Serverless microservices
   - Multi-cloud deployment

---

## 📚 **Recommended Resources**

### **Books**
- "Building Microservices" by Sam Newman
- "Microservices Patterns" by Chris Richardson
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "Release It!" by Michael Nygard

### **Online Courses**
- Microservices Architecture on Coursera
- Building Microservices with Node.js on Udemy
- Kubernetes for Developers on Pluralsight

### **Documentation**
- [Microservices.io](https://microservices.io/)
- [Martin Fowler's Blog](https://martinfowler.com/articles/microservices.html)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

### **Practice Projects**
- Build a simple e-commerce system
- Implement a social media platform
- Create a real-time chat application

---

## 🎉 **Conclusion**

Microservices is a powerful architectural pattern that can help you build scalable, maintainable applications. However, it comes with its own set of challenges and complexities.

**Key Takeaways:**
1. **Start Simple**: Begin with a few services and grow gradually
2. **Focus on Communication**: Choose the right patterns for service interaction
3. **Monitor Everything**: Implement comprehensive observability
4. **Handle Failures**: Build resilience into your system
5. **Security First**: Implement proper authentication and authorization
6. **Test Thoroughly**: Use multiple testing strategies
7. **Automate Everything**: CI/CD, infrastructure, and operations

Remember, microservices is not a silver bullet. It's a tool that can help you solve specific problems. Choose it when the benefits outweigh the complexity for your use case.

**Happy Learning! 🚀** 

## Why Are API Responses So Fast in Local Development?

When testing your API locally (e.g., with Postman), you may notice extremely fast response times (e.g., 10-12 ms) even without explicit caching. Here’s why:

### 1. Localhost Environment
- Both your backend and database (e.g., Postgres) run on your local machine, so there is virtually zero network latency.
- No cloud, firewall, or internet delays.

### 2. Database Internal Caching
- Modern databases like Postgres cache frequently accessed data in memory (buffer pool, query plan cache).
- Repeated queries for the same data are served from RAM, not disk, making them extremely fast.

### 3. Small Dataset
- Development databases are usually small, so queries are much faster than in production.

### 4. Minimal Middleware and Processing
- Your code likely does not have heavy middleware or complex business logic in development.

### 5. No Extra Caching Layers
- By default, Express, Prisma, and your dependencies do **not** cache HTTP responses.
- Postman does not cache API responses unless explicitly configured.

### 6. How to Confirm
- Restart your database and observe if the first request is slower.
- Add an artificial delay in your controller to see if response time increases.
- Test with a larger dataset or more complex queries to see real-world performance.

**Summary:**
Fast local responses are normal and expected. In production, with more data, real network latency, and heavier workloads, response times will be higher. 

## Cache Invalidation: Keeping Redis and Database Consistent

When using Redis (or any cache) to store data like bills, you must ensure the cache stays consistent with the database. If the underlying data changes (e.g., a bill is marked as paid), the cache can become stale and serve outdated information. This is a classic cache invalidation problem.

### Why Does This Happen?
- Caches (like Redis) store a copy of the data for a set time (TTL), but do not know when the database changes.
- If you update the database (e.g., change bill status to "Paid") but do not update or delete the cache, users may see old data until the cache expires.

### How to Handle Cache Invalidation
- **Delete the cache key** immediately after updating the database (recommended for most web apps):
  ```js
  await redisClient.del(`bill:${billId}`);
  ```
- **Or, update the cache** with the new value after a DB update:
  ```js
  await redisClient.setEx(`bill:${billId}`, 3600, JSON.stringify(updatedBill));
  ```
- This ensures the next read will fetch fresh data from the DB and re-cache it.

### Sample Flow
1. **GET /bill/123** (first time): Not in cache → fetch from DB → cache for 1 hour.
2. **PUT /bill/123 (mark as paid):** Update DB → delete or update `bill:123` in Redis.
3. **GET /bill/123** (within 1 hour): Not in cache (was deleted) → fetch fresh from DB → cache again.

### Key Points
- Always invalidate or update the cache when the underlying data changes.
- Relying only on TTL can lead to stale data and inconsistencies.
- This pattern is called **cache-aside** or **lazy caching**.

**Summary:**
Cache invalidation is critical for data consistency. Always clear or update your cache after any write operation to the database that affects cached data. 