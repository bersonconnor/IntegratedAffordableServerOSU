# Kubernetes Cluster Orchestration

## Set Up

You will need the AWS CLI and eksctl:
`choco install awscli eksctl`

To orchestrate the test cluster run:
`eksctl create cluster -f test-cluster.yml`
This will take a while, you can watch the cloudformation run in the AWS cluster.

Create the `tools` and the `affordable` namespaces:
```
kubectl create namespace tools
kubectl create namespace affordable
```

Apps should go in the `affordable` namespace while any dev tools such as CI runners should go in the `tools` namespace.
