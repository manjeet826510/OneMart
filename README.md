
# OneMart - MERN Ecommerce

A Mern Ecommerce website for buying products online.

## Demo Website

Render : https://onemart71.onrender.com/ (slow loading)

AWS EC2 : http://one-mart.live/ (fast loading)


## Run Locally

Clone the project

```bash
  git clone https://github.com/manjeet826510/OneMart.git
```

Go to the project directory

```bash
  cd OneMart
```
Open OneMart App in vs code

```bash
  code .
```
Open Terminal in vs code & create .env file inside backend folder

```bash
  cd backend && touch .env
```


Open .env file and paste below contents and provide the <value> of all these variables, generate yourself

```bash
JWT_SECRET = <value>
MONGODB_URI_LOCAL = <value>
MONGODB_URI = <value>
REACT_APP_RAZORPAY_KEY_ID=<value>
RAZORPAY_SECRET = <value>
AccessKey = <value>
SecretKey = <value>
region = <value>
bucket = <value>
```

To run backend - do cd backend first if you are not in backend directory
```bash
npm install
npm start
```
To run frontend: Open a new terminal
```bash
cd frontend
npm install
npm start
```
This will open the website on local host in the browser at
 http://localhost:3000

To login as admin - 
Create your user account and change the isAdmin field value from "false" to "true" inside the User Collection of your MongoDb account.



