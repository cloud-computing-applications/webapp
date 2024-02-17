#!/bin/bash

curl -SLO https://dev.mysql.com/get/mysql80-community-release-el9-5.noarch.rpm
md5sum mysql80-community-release-el9-5.noarch.rpm
sudo rpm -ivh mysql80-community-release-el9-5.noarch.rpm
sudo yum install mysql-server -y
sudo systemctl enable mysqld
sudo systemctl start mysqld

mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${DB_DATABASE};"
mysql -u root -e "CREATE USER IF NOT EXISTS '${DB_USERNAME}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
mysql -u root -e "GRANT ALL PRIVILEGES ON ${DB_DATABASE}.* TO '${DB_USERNAME}'@'localhost';"
