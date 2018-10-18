# WineSecureAzureEtherAdmin

## Get the code
git clone https://github.com/richardagreene/WineSecureAzureEtherAdmin.git

## installation of the Application
This application is designed to operate on the Azure Platform.
Access the Portal https://portal.azure.com
- Click Create Resource
- Enter "Ethereum Proof-of-Work Consortium"
- Click Create

Enter the following details
- Resource Prefix: ws 
- VM Username: WineSecureAdmin
- Authenication Type: password
- Password: [ your password ] 
- Confirm Password: [ your password ] 
- Subscription: [ your subscription ]
- Resource Group: [ WineSecure ]
- Location: [ your location ]
- Click OK

- No of Regions: 1
- First Region: [ your region ]
- Click OK

- No of Mining Nodes: 2
- Standard performance
- No of Transaction Nodes: 1
- Standard performance
- Click OK

- Consortium Member No: 101
- Network ID : 10101010
- Customer Genesis Block : No
- Ethereum Account Password : [ your password ] 
- Confirm Password : [ your password ] 
- Ethereum Private Key Passphrase : [ your passphrase ] 
- Confirm Passphrase : [ your passphrase ] 
- Click OK

- Monitoring : Disable
- Click OK

- Review the Summary
- Click OK


# update the default code on the server
- SSH to the transacton server: ssh -p 4000 [ adminUser ]@[ servername.cloudapp.azure.com ]
- Update the code form the GIT repository:
  git clone https://github.com/richardagreene/WineSecureAzureEtherAdmin.git
- Restart the service from the Azure Portal.

# To record results from load test on Transaction server
sudo tcpdump  -i eth0 'port 3000' -w etheradmin/public/loadtest.cap
download the results from the public website url.

# To record results from load test on Processing server
sudo tcpdump  -i eth0 'port 30303' -w etheradmin/public/loadtest.cap
