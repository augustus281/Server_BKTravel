# BKTravel
This is backend of BKTravel Project

# How to run project 
1. Git clone
2. npm install
3. npm run start
# BKTravel
This is backend of BKTravel Project

# How to run project 
1. Git clone https://github.com/DucHuy2801/Server_BKTravel.gi
2. Using docker to pull redis image with command line: __docker pull redis__
3. Create database in MySQL Workbench by command line: CREATE DATABASE 
If you don't install MySQL Workbench, you can install step by step follow link:
_https://www.simplilearn.com/tutorials/mysql-tutorial/mysql-workbench-installation_
4. Set up file .env follow:

APP_HOST=localhost
PORT=8080
NODE_ENV=dev
CLIENT_PORT=3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=bktravel
DB_USERNAME= #username when you install MySQL Workbench
DB_PASSWORD= #password you created when you install MySQL Workbench
JWT_SECRET=secret

USER_GMAIL=huybachkhoa2801@gmail.com
PASSWORD_GMAIL=


CLIENT_URL=http://localhost:8080/api/v1
APP_PASSWORD=qxkt yzpm teip toku

ACCESS_TOKEN_SECRET=access_token_secret
REFRESH_TOKEN_SECRET=refresh_token_secret

# SET UP CLOUDINARY FOR UPLOADING IMAGE
CLOUD_NAME=dlqfaksdl
API_KEY=418274762861918
API_SECRET=dcK3bfIsu9U8PcXlLSCCsNP9a94

# REDIS
REDIS_HOST=localhost
REDIS_PORT=6379

# SET UP VNPAY FOR PAYMENT
vnp_TmnCode=7ONWQPBC
vnp_HashSecret=NETBTJKFPMLLVDHFWGGHATPAHKWPLSRU
vnp_Url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
STK=9704198526191432198
BANK=NCB
ACCOUNT_NAME=NGUYEN VAN A
PASSWORD_OTP=123456
REALEASE_DATE=7/15
TZ=
vnp_ReturnUrl=https://domain.vn/VnPayReturn

### GOOGLE MAPS
API_KEY_MAP=q8D89V6TMt76juaJM38DZdkZxKU5V4JW

### LOGGER DISCORD FOR LOGGIN SYSTEM
TOKEN_DISCORD=
CHANNEL_ID=


### WEATHER
API_KEY_WEATHER=7de7d17fbaae862a18e526d2df2b0c3c

5. Cd to server folder and run command: npm install
6. Cd to server folder and run command: npm run start
