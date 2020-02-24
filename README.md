# AppCenter/Github Lambda Proxy

If you are building whitelabel applications using AppCenter and Github, you will struggle to get past 20 webhooks on _one_ Github repository.

More info on this issue is here: 

https://github.com/microsoft/appcenter/issues/591

This lambda reads the push event data from Github and fires off a POST request to build your apps on AppCenter.

## Todo

- [ ] Use Branch configuration API to check if the branch has been configured. (API call [here](https://openapi.appcenter.ms/#/build/branchConfigurations_get))

## Requirements

- You will need to connect your app to Github via AppCenter and configure builds for the specific branches you want to build from.
- You need to delete the webhook that AppCenter/Github creates on the repository you are building from, this keeps the App Center <-> Github connection but removes the webhook.
- Add your Lambda Webhook URL using AWS API Gateway.
- Add your App Center `X-API-TOKEN` to the Lambda enviroment variables.
