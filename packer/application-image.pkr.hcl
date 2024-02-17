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
  image_name          = "webapp"
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
    script = "update.sh"
  }

  provisioner "shell" {
    script = "setup-node.sh"
  }

  provisioner "shell" {
    environment_vars = [
      "DB_USERNAME=${var.DB_USERNAME}",
      "DB_PASSWORD=${var.DB_PASSWORD}",
      "DB_DATABASE=${var.DB_DATABASE}"
    ]
    script = "setup-db.sh"
  }
}