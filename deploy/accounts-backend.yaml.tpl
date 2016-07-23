# vim: set syntax=yaml:

# Service
apiVersion: v1
kind: Service
metadata:
  name: accounts-backend
  labels:
    run: accounts-backend
    subdomain: accounts-backend
spec:
  type: NodePort
  ports:
  - port: 80 # port to serve service on
    targetPort: 8080 # containers port
    protocol: TCP
  selector:
    app: accounts-backend
  # sessionAffinity: ClientIP

---

# Deployment
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: accounts-backend
spec:
  replicas: 2
  # pod definition
  template:
    metadata:
      labels:
        app: accounts-backend
    spec:
      containers:
      - name: accounts-backend
        image: {{IMAGE_NAME}}
        ports:
        - containerPort: 8080
