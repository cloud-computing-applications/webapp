# webapp

## Prerequisites
1. NodeJS v18.19.0 or above
2. npm v10.2.3 or above
3. MySQL Database Server running locally on port 3306
4. Download Packer v1.10.1 or above
5. Setup the following Environment Variables For Webapp
    - PORT - Enter the port you want to run the application on
    - DB_USERNAME - Enter your MySQL username
    - DB_PASSWORD - Enter your MySQL password
    - DB_DATABASE - Enter your MySQL database name
    - DB_TEST_DATABASE - Enter your MySQL test database name
    - DB_HOST - Enter your MySQL host (if running locally, this would be "localhost")
6. Setup the following Environment Variables For Packer
    - project_id - ID of your gcp project
    - zone - Zone of webapp image
    - source_image_family - source image family name
    - ssh_username - ssh username used by packer
    - image_family - webapp image family name (will also be used for image_name)
    - machine_type - machine type of the instance used for creating the image
    - disk_size - Disk size of the disk used in the instance which is used for creating the image
    - disk_type - Disk type of the disk used in the instance which is used for creating the image
    - network - network to use for the launched instance in order to create the image
    - environment - value for the image label "environment"

## Instructions For Running Application
1. Run ```npm install``` at the root directory to install all the dependencies
2. Run ```node index.js``` at the root directory to run the application

## Instructions For Creating Image using Packer
1. Run ```packer init packer/``` at the root directory to initialize packer
2. Run ```npm run build``` at the root directory to create application artifact
3. Run ```packer validate packer/``` at the root directory to validate packer templates
4. Run ```packer build packer/``` at the root directory to validate packer templates