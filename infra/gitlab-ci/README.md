# Install GitLab CI runner via helm

Add the helm repository:
`helm repo add gitlab https://charts.gitlab.io`

Install the chart:
`helm install --namespace tools gitlab-runner -f values.yml gitlab/gitlab-runner`