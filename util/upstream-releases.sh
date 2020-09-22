#!/bin/bash

# @todo create the dir/checkouts here if they don't exist already

for upstream in 'drops-7' 'drops-8' 'wordpress'
do
    cd ~/sites/upstreams/$upstream
    git pull origin master
    git log --tags --simplify-by-decoration --pretty="format:%ct" > ~/sites/upstreams/releases/$upstream.txt
done