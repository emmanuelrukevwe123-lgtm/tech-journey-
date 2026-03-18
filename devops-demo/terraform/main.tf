# 1. Tell Terraform we want to use the Docker provider 
# (a plugin that lets Terraform control Docker directly)
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

# 2. Configure the Docker provider to talk to your local Docker daemon
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# 3. Define our target infrastructure: An image
# Instead of `docker build`, Terraform pulls or manages the image for us
resource "docker_image" "api" {
  name         = "fastapi-devops-demo:latest"
  keep_locally = false 
  # (Simulates pulling an image from a cloud registry like AWS ECR)
}

# 4. Define our target infrastructure: A running container
# This replaces our `docker run` command!
resource "docker_container" "api_server" {
  image = docker_image.api.image_id
  name  = "production_api_server"

  # We define the port mappings exactly like our docker-compose file
  ports {
    internal = 8000
    external = 8000
  }
}
