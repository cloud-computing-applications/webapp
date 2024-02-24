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
  source_image_family = var.source_image_family
  zone                = var.zone
  ssh_username        = var.ssh_username
  network             = var.network
  image_name          = join("-", [var.image_family, formatdate("YYYY-MM-DD't'hh-mm-ss'z'", timestamp())])
  image_family     = var.image_family
  image_labels = {
    environment = var.environment
  }
  machine_type = var.machine_type
  disk_size    = var.disk_size
  disk_type    = var.disk_type
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
