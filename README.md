# Smart Search Component

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

This repository contains a reusable, framework-agnostic `<smart-search>` web component and a React-based banking demo application to showcase its functionality.

## Projects

-   **`banking-demo`**: A React application that showcases how to integrate and use the `smart-search` component.
-   **`smart-search`**: A framework-agnostic, reusable search web component.

## Installation & Setup

1.  **Install dependencies:**

    ```sh
    npm install
    ```

2.  **Run the Banking Demo App:**

    To serve the `banking-demo` application in development mode, run:

    ```sh
    npm start
    ```

    This will start the development server, and you can view the application at `http://localhost:4200`.

## Smart Search Component API

The `<smart-search>` web component is designed for easy integration. You can control it via properties and listen for user interactions via events.

### Properties

| Property      | Type                 | Description                                                                                                                                                             |
| :------------ | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`       | `SearchResultType[]` | An array of data objects to be displayed in the search results. Each object must conform to the `SearchResultType` interface: `{ id, title, description, category }`. |
| `loading`     | `boolean`            | Controls the loading state. Set to `true` while fetching data to display a loading indicator, and `false` once data is assigned to the `items` property.                |
| `placeholder` | `string`             | The placeholder text to display in the search input field when it is empty.                                                                                             |

### Events

#### `item-selected`

This custom event is dispatched when a user selects an item from the search results. The selected item object is passed in the `detail` property of the event.

### React Usage Example

Here is an example of how to integrate the component in a React application using a `ref` to handle the `item-selected` event.

```jsx
import { useEffect, useRef, useState } from 'react';

function App() {
  const searchRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const currentRef = searchRef.current;
    const handleSelect = (event) => {
      console.log('Item selected:', event.detail);
      setSelectedItem(event.detail);
    };

    currentRef?.addEventListener('item-selected', handleSelect);

    return () => {
      currentRef?.removeEventListener('item-selected', handleSelect);
    };
  }, []);

  // In your JSX:
  // <smart-search ref={searchRef} items={...} loading={...}></smart-search>
}
```

## Development & Testing

### Running Tests

You can run unit tests for each project individually:

```sh
# Run tests for the banking-demo application
npm run test-banking-app

# Run tests for the smart-search component library
npm test
```