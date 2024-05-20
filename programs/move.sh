#!/bin/bash

# Function to convert snake_case to PascalCase
convert_to_pascal_case() {
    echo "$1" | awk -F'_' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS=''
}

# Define source and destination directories
source_dir="target/idl"
destination_dir="../clients/rwa-token-sdk/src/programs/idls"

# Iterate over all JSON files in the source directory
for file in "$source_dir"/*.json; do
    filename=$(basename "$file" .json)
    pascal_case_filename=$(convert_to_pascal_case "$filename")
    cp "$file" "$destination_dir/$pascal_case_filename.json"
done


# Define source and destination directories
source_dir="target/types"
destination_dir="../clients/rwa-token-sdk/src/programs/types"


# Iterate over all ts files in the source directory
for file in "$source_dir"/*.ts; do
    filename=$(basename "$file" .ts)
    pascal_case_filename=$(convert_to_pascal_case "$filename")
    new_filename="${pascal_case_filename}Types.ts"
    cp "$file" "$destination_dir/$new_filename"
done
