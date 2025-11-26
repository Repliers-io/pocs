#!/bin/bash

# Parse command line arguments
TOP_DIR="."  # default to current directory
while [[ $# -gt 0 ]]; do
    case $1 in
        --top-dir)
            TOP_DIR="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--top-dir <directory>]"
            exit 1
            ;;
    esac
done

target_hashes_256=(
    ### v1 bundle.js hashes
    "de0e25a3e6c1e1e5998b306b7141b3dc4c0088da9d7bb47c1c00c91e6e4f85d6"
    "81d2a004a1bca6ef87a1caf7d0e0b355ad1764238e40ff6d1b1cb77ad4f595c3"
    "83a650ce44b2a9854802a7fb4c202877815274c129af49e6c2d1d5d5d55c501e"
    "4b2399646573bb737c4969563303d8ee2e9ddbd1b271f1ca9e35ea78062538db"
    "dc67467a39b70d1cd4c1f7f7a459b35058163592f4a9e8fb4dffcbba98ef210c"
    "46faab8ab153fae6e80e7cca38eab363075bb524edd79e42269217a083628f09"
    "b74caeaa75e077c99f7d44f46daaf9796a3be43ecf24f2a1fd381844669da777"
    #"e5c6eae4753c2e7d5b7279093cb4377bd3170e3de85e0567ca449be8d9b81b75" # test digest
)

target_hashes_1=(
    #v2 bun_environment.js hashes
    "d60ec97eea19fffb4809bc35b91033b52490ca11"
    "3d7570d14d34b0ba137d502f042b27b0f37a59fa"
    # setup_bun.js
    "d1829b4708126dcc7bea7437c04d1f10eacd4a16"
)

echo "Searching in directory: $TOP_DIR"
echo "===================="

find "$TOP_DIR" -path "*/node_modules/*" \( -name "bundle.js" -o -name "bun_environment.js" -o -name "setup_bun.js" \) 2>/dev/null | while read file; do
    echo "Checking: $file for sha-256 hashes..."
    hash_256=$(shasum -a 256 "$file" 2>/dev/null | cut -d' ' -f1)

    for i in "${!target_hashes_256[@]}"; do
        if [ "$hash_256" = "${target_hashes_256[$i]}" ]; then
            echo "*** MATCH FOUND ***"
            echo "File: $file"
            echo "SHA-256: $hash_256"
            echo "Matches: Hash $((i+1))"
            echo "===================="
            break
        fi
    done

    echo "Checking: $file for sha-1 hashes..."
    hash_1=$(shasum -a 1 "$file" 2>/dev/null | cut -d' ' -f1)

    for i in "${!target_hashes_1[@]}"; do
        if [ "$hash_1" = "${target_hashes_1[$i]}" ]; then
            echo "*** MATCH FOUND ***"
            echo "File: $file"
            echo "SHA-1: $hash_1"
            echo "Matches: Hash $((i+1))"
            echo "===================="
            break
        fi
    done
done

echo "--------------------"
echo "*** SEARCH COMPLETE ***"
