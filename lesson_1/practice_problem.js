function createBook(title, author, read = false) {
  return {
    Title: title,
    Author: author,
    read: read,
    getDescription() {
      if (this.read === true) {
        return `${this.Title} was written by ${this.Author}. I have read it.`;
      } else return `${this.Title} was written by ${this.Author}. I haven't read it.`;
    },
    readBook() {
      this.read = true;
    }
  };
}

let book1 = createBook('Mythos', 'Stephen Fry');
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = createBook("Aunts aren't Gentlemen", 'PG Wodehouse');

console.log(book1.getDescription()); // Mythos was written by David Fry. I haven't read it.
console.log(book1.readBook());
console.log(book1.getDescription()); // Mythos was written by David Fry. I have read it.