variable "project_id" {
  type = string
}

variable "zone" {
  type = string
}

variable "network" {
  type = string
}

variable "environment" {
  type = string
}

variable "DB_USERNAME" {
    type = string
    default = env("DB_USERNAME")
    sensitive = true
}

variable "DB_PASSWORD" {
    type = string
    default = env("DB_PASSWORD")
    sensitive = true
}

variable "DB_DATABASE" {
    type = string
    default = env("DB_DATABASE")
    sensitive = true
}

variable "credentials" {
  type = string
  default = env("GCP_PACKER_CREDENTIALS")
  sensitive = true
}