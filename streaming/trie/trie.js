const fs = require('fs');
require('dotenv').config();
const TRIE_DIR = process.env.TRIE_DIR || './trie'

class TrieNode {
    constructor(){
        this.isEndWord = false;
        this.children = [];
    }
};

class Trie {
    constructor() {
        this.root = new TrieNode();
        const words = fs.readFileSync(`${TRIE_DIR}/words.txt`, 'utf8').split(' ');
        if(words.length === 0) return;
        for (const word of words) {
            this.insert(word, false);
        }
    }

    insert(word, shouldPersist = true) {}
    search(word) {}
    parsedSearch(word) {}
    util(node, level, prevChar) {}
};

Trie.prototype.insert = function (word, shouldPersist = true){
    word = word.toLowerCase();
    let node = this.root;
    for(const char of word){
        if(!node.children[char]){
            node.children[char] = new TrieNode();
        }
        node = node.children[char];
    }
    if(node.isEndWord) return false;
    node.isEndWord = true;
    if(shouldPersist) fs.appendFile(`${TRIE_DIR}/words.txt`, word + ' ', err => 0);
}

Trie.prototype.search = function (word) {
    word = word.toLowerCase();
    let node = this.root;
    for(const char of word){
        if(!node.children[char]) return false;
        node = node.children[char];
    }
    return node.isEndWord;
}

Trie.prototype.parsedSearch = function (string) {
    string = string.toLowerCase();
    let words = string.split(' ');
    let result = [];
    for(const word of words){

        let node = this.root;
        for(const char of word){
            if(!node.children[char]) break;
            node = node.children[char];
        }

        if(node.isEndWord) result.push(word);
        else {
            let enhancedString = this.util(node,3,'');
            if(enhancedString !== '') result.push(enhancedString.split(' ').map(ele => word + ele).join(' '));
        }
    }
    return result.join(' ');
}

Trie.prototype.util = function (node, level, prevChar){
    if(level < 0) return '';
    if(node.isEndWord) return prevChar;
    const words = [];
    for(const char in node.children){
        let word = this.util(node.children[char],level-1,char);
        if(word !== '') words.push(prevChar + word);
    }
    return words.join(' ');
}

const trie = new Trie();

function parseQuery(query){
    return trie.parsedSearch(query);
}

function insertWord(word){
    trie.insert(word);
}

module.exports = {
    parseQuery,
    insertWord
}