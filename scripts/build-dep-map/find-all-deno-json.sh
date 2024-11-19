# Function to find all `deno.json` and `deno.jsonc` files
find_deno_packages() {
  local start_dir="${1:-$PWD}" # Default to current directory if no argument is provided
  declare -a queue=("$start_dir") # Initialize queue with the start directory
  local packages=() # Array to store found packages

  # Function to process a directory
  process_directory() {
    local dir="$1"

    # Find all `deno.json` or `deno.jsonc` files in the current directory
    for file in "$dir/deno.json" "$dir/deno.jsonc"; do
      if [ -f "$file" ]; then
        packages+=("$(realpath "$file")")
      fi
    done

    # Add all subdirectories to the queue
    for subdir in "$dir"/*; do
      if [ -d "$subdir" ]; then
        queue+=("$subdir")
      fi
    done
  }

  # Perform BFS
  while [ ${#queue[@]} -gt 0 ]; do
    current_dir="${queue[0]}"
    queue=("${queue[@]:1}") # Remove the first element

    process_directory "$current_dir"
  done

  # Print all found packages
  for pkg in "${packages[@]}"; do
    echo "$pkg"
  done
}
