variable "project_id" {
  type = string
}

variable "zone" {
  type = string
}

variable "source_image_family" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "image_family" {
  type = string
}

variable "machine_type" {
  type = string
}

variable "disk_size" {
  type = number
}

variable "disk_type" {
  type = string
}

variable "network" {
  type = string
}

variable "environment" {
  type = string
}

variable "credentials" {
  type      = string
  default   = env("GCP_PACKER_CREDENTIALS")
  sensitive = true
}

variable "LOG_FILE_PATH" {
  type      = string
  default   = env("LOG_FILE_PATH")
  sensitive = true
}