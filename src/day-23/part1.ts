import fs from "fs";

type Graph = Map<string, Set<string>>;
type Triangle = [string, string, string];

const findTriangles = (graph: Graph): Triangle[] => {
  const triangles: Triangle[] = [];
  for (const [node, neighbors] of graph) {
    for (const neighbor of neighbors) {
      for (const other of neighbors) {
        if (neighbor !== other && graph.get(neighbor)?.has(other)) {
          // Sort and ensure unique triangles
          const triangle = [node, neighbor, other].sort();
          if (
            !triangles.some(
              (t) =>
                t[0] === triangle[0] &&
                t[1] === triangle[1] &&
                t[2] === triangle[2]
            )
          ) {
            triangles.push([triangle[0], triangle[1], triangle[2]]);
          }
        }
      }
    }
  }
  return triangles;
};

const main = () => {
  console.time("day 23 - part 1");
  const input = fs.readFileSync(__dirname + "/input.txt", "utf8").trim();
  const connections: string[][] = input
    .split("\n")
    .map((connection) => connection.split("-"));

  const graph: Graph = new Map();

  connections.forEach(([x, y]) => {
    if (!graph.has(x)) graph.set(x, new Set());
    if (!graph.has(y)) graph.set(y, new Set());

    graph.get(x)!.add(y);
    graph.get(y)!.add(x);
  });

  const triangles = findTriangles(graph);
  const filteredTriangles = triangles.filter((triangle) => {
    return triangle.some((node) => node.startsWith("t"));
  });
  console.log(filteredTriangles.length);
  console.timeEnd("day 23 - part 1");
};

main();
