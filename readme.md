# Accounts backend

Standalone authentication service

## Requirements

- redis: for storing session tokens
- mongo: for storing user accounts

## API

#### `/api/verify`
- This endpoint can be used by other services to verify jwt. Each service can obtain jwt from cookies set by `/api/signup` or `/api/login`

These are used by the accounts frontend
#### `/api/signup`
#### `/api/login`