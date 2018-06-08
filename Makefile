#This file defines the common targets across our Node.js services
#note MAKEFILE_SUDO_COMMAND will be sudo -n when run from jenkinsfile
#you shouldnt need to set it on a mac for example

NODE_ENV ?= development
DOCKER_COMPOSE ?= docker-compose
DEV_ARGS ?= -f docker-compose.yml -f docker-compose.dev.yml
ADMIN_ARGS ?= -f docker-compose.yml -f docker-compose.admin.yml
RUN_ARGS ?= run --rm
RUN_AS_USER ?=

all: clean-up install lint unit-test component-test

install:
	npm install --no-optional
.PHONY: install

lint:
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_COMPOSE} ${DEV_ARGS} ${RUN_ARGS} ${RUN_AS_USER} lint
.PHONY: lint

unit-test:
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_COMPOSE} ${DEV_ARGS} ${RUN_ARGS} ${RUN_AS_USER} unit-test
.PHONY: unit-test

component-test:
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_COMPOSE} ${DEV_ARGS} ${RUN_ARGS} ${RUN_AS_USER} component-test
.PHONY: component-test

# build:
# 	${MAKEFILE_SUDO_COMMAND} ${DOCKER_COMPOSE} ${DEV_ARGS} ${RUN_ARGS} ${RUN_AS_USER} build
# .PHONY: build

dependency-check:
	./node_modules/.bin/nsp check
.PHONY: dependency-check

prepare-release:
.PHONY: prepare-release

publish:
	npm publish
.PHONY:

clean:
	${MAKEFILE_SUDO_COMMAND} ${DOCKER_COMPOSE} down
.PHONY: clean-up
