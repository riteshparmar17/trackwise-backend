# TrackWise

TrackWise is a full-stack SaaS application built with the MEAN stack to help users manage vehicle mileage, track expenses, monitor spending, and generate business-ready reports.

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Refresh token support
- Email verification
- Forgot password and password reset
- Protected routes and API endpoints
- Auth guards and HTTP interceptors

---

### Dashboard

- Personalized user dashboard
- Total drives summary
- Incomplete drive tracking
- Total distance traveled
- Total expenses overview
- Recent drive activity
- Recent expense activity
- Quick access to key metrics

---

### Drive Logs

- Create, edit, and delete drive logs
- Track trip dates, distance, purpose, and notes
- Automatic mileage calculation
- Pending and completed drive status tracking
- Date range filtering
- Pagination support
- Total mileage summaries
- Drive count summaries
- Mileage validation

---

### Expense Management

- Create, edit, and delete expenses
- Categorize expenses by type
- Vendor tracking
- Receipt image uploads
- Receipt replacement and deletion
- Cloudinary integration
- Automatic HST calculation (13%)
- Date and category filtering
- Server-side sorting
- Pagination support
- Total expense summaries
- Tax summaries
- Entry count summaries

---

### Reporting

Generate business-ready reports using drive and expense data.

#### Report Summary

- Total Kilometers
- Total Spending
- Total HST

#### KMs By Month

Monthly mileage breakdown including:

- Year
- Month
- Number of Trips
- Total Kilometers

#### Expenses By Category

Category-based expense reporting including:

- Category
- Entry Count
- Total HST
- Total Amount

#### Report Filters

- From Date
- To Date
- Date range validation
- Reset filters

#### Export Options

- Excel Export (.xlsx)
- PDF Export (.pdf)

---

### Receipt Management

Supported file types:

- JPG
- JPEG
- PNG
- WEBP
- HEIC
- HEIF

Features:

- Upload receipt images
- Mobile camera support
- Receipt preview
- Replace receipt
- Delete receipt
- Cloudinary storage integration

---

### User Experience

- Responsive Bootstrap 5 interface
- Mobile-friendly layouts
- Mobile filter collapse
- Reusable confirmation dialogs
- Toast notifications
- Form validation feedback
- Custom 404 page
- Responsive dashboard cards
- Responsive reports

---

## Technical Features

### Frontend

- Angular 19
- Standalone Components
- TypeScript
- Reactive Forms
- Bootstrap 5
- Route Guards
- HTTP Interceptors

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- RESTful API Architecture

### Cloud Services

- Cloudinary image storage
- SendGrid email delivery

### Deployment

- Cloudflare Pages (Frontend)
- Render (Backend)

---

## Architecture

### Backend Structure

models/
services/
controllers/
routes/

```

### Frontend Structure

features/
shared/
core/
```

Business logic is centralized in services while controllers remain thin and focused.

---

## Security

- JWT Authentication
- Refresh Tokens
- Protected API Endpoints
- User-Scoped Data Access
- Password Reset Workflow
- Email Verification Workflow

---

## Current Release

### v1.2.0

Included Features:

- Authentication System
- Drive Logs Management
- Expense Management
- Dashboard
- Reporting Module
- PDF Export
- Excel Export
- Receipt Uploads
- Responsive Mobile Experience
- Cloudinary Integration
- SendGrid Integration
