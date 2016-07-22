# Service
apiVersion: v1
kind: Service
metadata:
  name: accounts
  labels:
    run: accounts
    subdomain: accounts
spec:
  type: NodePort
  ports:
  - port: 80 # port to serve service on
    targetPort: 8080 # containers port
    protocol: TCP
  selector:
    app: accounts
  # sessionAffinity: ClientIP

---

# Deployment
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: accounts
spec:
  replicas: 2
  # pod definition
  template:
    metadata:
      labels:
        app: accounts
    spec:
      containers:
      - name: accounts
        image: {{IMAGE_NAME}}
        ports:
        - containerPort: 8080
