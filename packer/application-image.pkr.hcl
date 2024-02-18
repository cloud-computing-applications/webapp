packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.0.0"
    }
  }
}

source "googlecompute" "application-image" {
  project_id          = var.project_id
  credentials_json    = var.credentials
  source_image_family = "centos-stream-8"
  zone                = var.zone
  ssh_username        = "packer"
  network             = var.network
  image_name          = "webapp-${formatdate("YYYY-MM-DD't'hh-mm-ss'z'",timestamp())}"
  image_family        = "webapp"
  image_labels = {
    environment = var.environment
  }
  machine_type = "e2-medium"
  disk_size    = 20
  disk_type    = "pd-standard"
}

build {
  sources = ["source.googlecompute.application-image"]

  provisioner "shell" {
    script = "packer/update.sh"
  }

  provisioner "shell" {
    script = "packer/setup-node.sh"
  }

  provisioner "shell" {
    environment_vars = [
      "DB_USERNAME=${var.DB_USERNAME}",
      "DB_PASSWORD=${var.DB_PASSWORD}",
      "DB_DATABASE=${var.DB_DATABASE}"
    ]
    script = "packer/setup-db.sh"
  }

  provisioner "file" {
    source      = "dist/webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    script = "packer/setup-project.sh"
  }

  provisioner "shell" {
    script = "packer/setup-system-user.sh"
  }

  provisioner "file" {
    source      = "packer/csye6225.service"
    destination = "/tmp/csye6225.service"
  }

  provisioner "shell" {
    script = "packer/setup-service.sh"
  }
}