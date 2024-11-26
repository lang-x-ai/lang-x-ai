lang: py {
    prompt: "A CRUD API for managing items in a store";
    const database = [];

    {
        prompt: "Function to create an item";
        function createItem(item) {
            database.append(item)
            return f"Item '{item}' added."
        }

        prompt: "Function to read all items";
        function readItems() {
            return database
        }

        prompt: "Function to update an item";
        function updateItem(index, newItem) {
            database[index] = newItem
            return f"Item at index {index} updated to '{newItem}'."
        }

        prompt: "Function to delete an item";
        function deleteItem(index) {
            deleted = database.pop(index)
            return f"Item '{deleted}' deleted."
        }
    }
}
