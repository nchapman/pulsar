/* eslint-disable max-classes-per-file,no-use-before-define */

class ChatNode<T> {
  value: T;

  next: ChatNode<T> | null;

  prev: ChatNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList<T> {
  head: ChatNode<T> | null;

  tail: ChatNode<T> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  // Add a node to the end of the list
  append(value: T): void {
    const newChatNode = new ChatNode(value);
    if (!this.head) {
      this.head = newChatNode;
      this.tail = newChatNode;
    } else if (this.tail) {
      this.tail.next = newChatNode;
      newChatNode.prev = this.tail;
      this.tail = newChatNode;
    }
  }

  // Add a node to the beginning of the list
  prepend(value: T): void {
    const newChatNode = new ChatNode(value);
    if (!this.head) {
      this.head = newChatNode;
      this.tail = newChatNode;
    } else {
      newChatNode.next = this.head;
      this.head.prev = newChatNode;
      this.head = newChatNode;
    }
  }

  // Remove a node with a specific value
  remove(value: T): void {
    if (!this.head) return;

    let current: ChatNode<T> | null = this.head;
    while (current) {
      if (current.value === value) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }
        return;
      }
      current = current.next;
    }
  }

  // Print the list
  printList(): void {
    let current = this.head;
    let list = '';
    while (current) {
      list += `${current.value} `;
      current = current.next;
    }

    // @ts-ignore
    console.log(list.trim());
  }
}
