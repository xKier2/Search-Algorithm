# Search Algorithm

An interactive web-based visualization of fundamental graph search algorithms. The project demonstrates how **Breadth-First Search (BFS)**, **Depth-First Search (DFS)**, and **A\* Search** explore a graph and determine a path from a starting node to a goal node.

The visualization shows a simple way to observe the behavior of each algorithm step-by-step, making it useful for learning and understanding graph traversal and pathfinding concepts.

##Features

- **Breadth-First Search (BFS)** — explores the graph level by level.
- **Depth-First Search (DFS)** — explores as far as possible along a branch before backtracking.
- **A\* Search** — finds a path using edge costs and a distance-based heuristic.
- Animated node exploration.
- Animated final path.
- Displays the resulting path and its total cost.
- Interactive graph rendered using the HTML "<canvas>" element.
- Responsive layout that adjusts to the available screen size.

##Algorithms

###Breadth-First Search

BFS explores nodes level by level using a queue. It is useful for finding the shortest path in terms of the number of edges in an unweighted graph.

###Depth-First Search

DFS explores one branch as deeply as possible before backtracking. It uses a stack-based traversal approach.

###A* Search

A* combines the actual cost of reaching a node with a heuristic estimate of the remaining distance to the goal. In this project, edge weights are used as movement costs and a distance-based heuristic helps guide the search toward the goal.

##Project Structure
```text
Search-Algorithm/
├── index.html
├── style.css
├── script.js
├── LICENSE
└── README.md
```

##Requirements

No external libraries, frameworks, packages, or build tools are required.

A modern web browser such as:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

is sufficient to run the project.

Build Instructions

No build process is required.

The project consists of static HTML, CSS, and JavaScript files that can be opened directly in a web browser.

## Running the Project

### Option 1 — Open Directly

Clone the repository:

```text
git clone https://github.com/xKier2/Search-Algorithm.git
```

Navigate into the project:

```text
cd Search-Algorithm
```

Open "index.html" in a modern web browser.

### Option 2 — Using a Local Server

You can also serve the project using any simple local HTTP server.

For example, with Python:
```text
python -m http.server
```

Then open:

```text
http://localhost:8000
```

## Usage

1. Open the application.
2. Select **BFS**, **DFS,** or **A\*** from the navigation tabs.
3. Watch the algorithm explore the graph.
4. Once exploration finishes, the resulting path is animated.
5. The application displays the discovered path and its total cost.

The graph uses nodes A–J, with A as the starting node and J as the goal node.

## Bug Tracker

Bug reports and issues can be submitted through the repository's GitHub Issues page:

https://github.com/xKier2/Search-Algorithm/issues

## Author
### Kier Gabriel Tongol (xKier2)

For questions, suggestions, or bug reports, please use the GitHub repository's Issues section.

## License

This project is licensed under the MIT License. See the ""LICENSE"" (./LICENSE) file for details.