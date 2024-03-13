import React, { useEffect, useState } from "react";
import { useProjectData } from "../../../../context/ProjectDataContext";
import Card from "components/common/Card";
import { getPolygonByCadastralNumber } from "services/getPolygonByCadastralNumber";
import { getPredialDataByCadastralNumber } from "services/getPredialDataByCadastralNumber";
import { getPredialData2ByCadastralNumber } from "services/getPredialData2ByCadastralNumber";
import { generateJSONFile } from "utilities/generateJsonFile";
import { Button } from "react-bootstrap";
import BarGraphComponent from "./BarGraphComponent";
import SankeyGraphComponent from "./SankeyGraphComponent";
const data = {
  graphJSON_barras: {
    data: [
      {
        name: "\u00c1reas Anterior",
        text: ["35.316", "7.297", "0.302", "0.024", "0.004", "0.001", "0.000"],
        textposition: "auto",
        x: [
          "Vegetaci\u00f3n Muy Alta",
          "Vegetaci\u00f3n Alta",
          "Vegetaci\u00f3n Moderada",
          "Vegetaci\u00f3n Baja",
          "Vegetaci\u00f3n Muy Baja",
          "Sin Vegetaci\u00f3n",
          "Otros Registros",
        ],
        y: [35.316, 7.297, 0.302, 0.024, 0.004, 0.001, 0.0],
        type: "bar",
      },
      {
        name: "\u00c1reas Posterior",
        text: ["30.898", "6.202", "0.868", "0.077", "0.014", "0.000", "0.000"],
        textposition: "auto",
        x: [
          "Vegetaci\u00f3n Muy Alta",
          "Vegetaci\u00f3n Alta",
          "Vegetaci\u00f3n Moderada",
          "Vegetaci\u00f3n Baja",
          "Vegetaci\u00f3n Muy Baja",
          "Sin Vegetaci\u00f3n",
          "Otros Registros",
        ],
        y: [30.898, 6.202, 0.868, 0.077, 0.014, 0.0, 0.0],
        type: "bar",
      },
    ],
    layout: {
      barmode: "group",
      title: {
        text: "Evoluci\u00f3n de \u00c1reas",
      },
      xaxis: {
        title: {
          text: "Categor\u00edas",
        },
      },
      yaxis: {
        title: {
          text: "\u00c1rea (hect\u00e1reas)",
        },
      },
      template: {
        data: {
          histogram2dcontour: [
            {
              type: "histogram2dcontour",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          choropleth: [
            {
              type: "choropleth",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
            },
          ],
          histogram2d: [
            {
              type: "histogram2d",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          heatmap: [
            {
              type: "heatmap",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          heatmapgl: [
            {
              type: "heatmapgl",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          contourcarpet: [
            {
              type: "contourcarpet",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
            },
          ],
          contour: [
            {
              type: "contour",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          surface: [
            {
              type: "surface",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          mesh3d: [
            {
              type: "mesh3d",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
            },
          ],
          scatter: [
            {
              fillpattern: {
                fillmode: "overlay",
                size: 10,
                solidity: 0.2,
              },
              type: "scatter",
            },
          ],
          parcoords: [
            {
              type: "parcoords",
              line: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scatterpolargl: [
            {
              type: "scatterpolargl",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          bar: [
            {
              error_x: {
                color: "#2a3f5f",
              },
              error_y: {
                color: "#2a3f5f",
              },
              marker: {
                line: {
                  color: "#E5ECF6",
                  width: 0.5,
                },
                pattern: {
                  fillmode: "overlay",
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: "bar",
            },
          ],
          scattergeo: [
            {
              type: "scattergeo",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scatterpolar: [
            {
              type: "scatterpolar",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          histogram: [
            {
              marker: {
                pattern: {
                  fillmode: "overlay",
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: "histogram",
            },
          ],
          scattergl: [
            {
              type: "scattergl",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scatter3d: [
            {
              type: "scatter3d",
              line: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scattermapbox: [
            {
              type: "scattermapbox",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scatterternary: [
            {
              type: "scatterternary",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scattercarpet: [
            {
              type: "scattercarpet",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          carpet: [
            {
              aaxis: {
                endlinecolor: "#2a3f5f",
                gridcolor: "white",
                linecolor: "white",
                minorgridcolor: "white",
                startlinecolor: "#2a3f5f",
              },
              baxis: {
                endlinecolor: "#2a3f5f",
                gridcolor: "white",
                linecolor: "white",
                minorgridcolor: "white",
                startlinecolor: "#2a3f5f",
              },
              type: "carpet",
            },
          ],
          table: [
            {
              cells: {
                fill: {
                  color: "#EBF0F8",
                },
                line: {
                  color: "white",
                },
              },
              header: {
                fill: {
                  color: "#C8D4E3",
                },
                line: {
                  color: "white",
                },
              },
              type: "table",
            },
          ],
          barpolar: [
            {
              marker: {
                line: {
                  color: "#E5ECF6",
                  width: 0.5,
                },
                pattern: {
                  fillmode: "overlay",
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: "barpolar",
            },
          ],
          pie: [
            {
              automargin: true,
              type: "pie",
            },
          ],
        },
        layout: {
          autotypenumbers: "strict",
          colorway: [
            "#636efa",
            "#EF553B",
            "#00cc96",
            "#ab63fa",
            "#FFA15A",
            "#19d3f3",
            "#FF6692",
            "#B6E880",
            "#FF97FF",
            "#FECB52",
          ],
          font: {
            color: "#2a3f5f",
          },
          hovermode: "closest",
          hoverlabel: {
            align: "left",
          },
          paper_bgcolor: "white",
          plot_bgcolor: "#E5ECF6",
          polar: {
            bgcolor: "#E5ECF6",
            angularaxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
            radialaxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
          },
          ternary: {
            bgcolor: "#E5ECF6",
            aaxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
            baxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
            caxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
          },
          coloraxis: {
            colorbar: {
              outlinewidth: 0,
              ticks: "",
            },
          },
          colorscale: {
            sequential: [
              [0.0, "#0d0887"],
              [0.1111111111111111, "#46039f"],
              [0.2222222222222222, "#7201a8"],
              [0.3333333333333333, "#9c179e"],
              [0.4444444444444444, "#bd3786"],
              [0.5555555555555556, "#d8576b"],
              [0.6666666666666666, "#ed7953"],
              [0.7777777777777778, "#fb9f3a"],
              [0.8888888888888888, "#fdca26"],
              [1.0, "#f0f921"],
            ],
            sequentialminus: [
              [0.0, "#0d0887"],
              [0.1111111111111111, "#46039f"],
              [0.2222222222222222, "#7201a8"],
              [0.3333333333333333, "#9c179e"],
              [0.4444444444444444, "#bd3786"],
              [0.5555555555555556, "#d8576b"],
              [0.6666666666666666, "#ed7953"],
              [0.7777777777777778, "#fb9f3a"],
              [0.8888888888888888, "#fdca26"],
              [1.0, "#f0f921"],
            ],
            diverging: [
              [0, "#8e0152"],
              [0.1, "#c51b7d"],
              [0.2, "#de77ae"],
              [0.3, "#f1b6da"],
              [0.4, "#fde0ef"],
              [0.5, "#f7f7f7"],
              [0.6, "#e6f5d0"],
              [0.7, "#b8e186"],
              [0.8, "#7fbc41"],
              [0.9, "#4d9221"],
              [1, "#276419"],
            ],
          },
          xaxis: {
            gridcolor: "white",
            linecolor: "white",
            ticks: "",
            title: {
              standoff: 15,
            },
            zerolinecolor: "white",
            automargin: true,
            zerolinewidth: 2,
          },
          yaxis: {
            gridcolor: "white",
            linecolor: "white",
            ticks: "",
            title: {
              standoff: 15,
            },
            zerolinecolor: "white",
            automargin: true,
            zerolinewidth: 2,
          },
          scene: {
            xaxis: {
              backgroundcolor: "#E5ECF6",
              gridcolor: "white",
              linecolor: "white",
              showbackground: true,
              ticks: "",
              zerolinecolor: "white",
              gridwidth: 2,
            },
            yaxis: {
              backgroundcolor: "#E5ECF6",
              gridcolor: "white",
              linecolor: "white",
              showbackground: true,
              ticks: "",
              zerolinecolor: "white",
              gridwidth: 2,
            },
            zaxis: {
              backgroundcolor: "#E5ECF6",
              gridcolor: "white",
              linecolor: "white",
              showbackground: true,
              ticks: "",
              zerolinecolor: "white",
              gridwidth: 2,
            },
          },
          shapedefaults: {
            line: {
              color: "#2a3f5f",
            },
          },
          annotationdefaults: {
            arrowcolor: "#2a3f5f",
            arrowhead: 0,
            arrowwidth: 1,
          },
          geo: {
            bgcolor: "white",
            landcolor: "#E5ECF6",
            subunitcolor: "white",
            showland: true,
            showlakes: true,
            lakecolor: "white",
          },
          title: {
            x: 0.05,
          },
          mapbox: {
            style: "light",
          },
        },
      },
    },
  },
  graphJSON_sankey: {
    data: [
      {
        link: {
          source: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
          target: [2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7],
          value: [
            1.0, 4.0, 22.0, 272.0, 6567.0, 31784.0, 0.0, 13.0, 69.0, 781.0,
            5582.0, 27808.0,
          ],
        },
        node: {
          label: [
            "Imagen Anterior",
            "Imagen Actual",
            "Sin Vegetaci\u00f3n",
            "Vegetaci\u00f3n Muy Baja",
            "Vegetaci\u00f3n Baja",
            "Vegetaci\u00f3n Moderada",
            "Vegetaci\u00f3n Alta",
            "Vegetaci\u00f3n Muy Alta",
          ],
          line: {
            color: "black",
            width: 0.5,
          },
          pad: 15,
          thickness: 20,
        },
        type: "sankey",
      },
    ],
    layout: {
      template: {
        data: {
          histogram2dcontour: [
            {
              type: "histogram2dcontour",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          choropleth: [
            {
              type: "choropleth",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
            },
          ],
          histogram2d: [
            {
              type: "histogram2d",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          heatmap: [
            {
              type: "heatmap",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          heatmapgl: [
            {
              type: "heatmapgl",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          contourcarpet: [
            {
              type: "contourcarpet",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
            },
          ],
          contour: [
            {
              type: "contour",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          surface: [
            {
              type: "surface",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
              colorscale: [
                [0.0, "#0d0887"],
                [0.1111111111111111, "#46039f"],
                [0.2222222222222222, "#7201a8"],
                [0.3333333333333333, "#9c179e"],
                [0.4444444444444444, "#bd3786"],
                [0.5555555555555556, "#d8576b"],
                [0.6666666666666666, "#ed7953"],
                [0.7777777777777778, "#fb9f3a"],
                [0.8888888888888888, "#fdca26"],
                [1.0, "#f0f921"],
              ],
            },
          ],
          mesh3d: [
            {
              type: "mesh3d",
              colorbar: {
                outlinewidth: 0,
                ticks: "",
              },
            },
          ],
          scatter: [
            {
              fillpattern: {
                fillmode: "overlay",
                size: 10,
                solidity: 0.2,
              },
              type: "scatter",
            },
          ],
          parcoords: [
            {
              type: "parcoords",
              line: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scatterpolargl: [
            {
              type: "scatterpolargl",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          bar: [
            {
              error_x: {
                color: "#2a3f5f",
              },
              error_y: {
                color: "#2a3f5f",
              },
              marker: {
                line: {
                  color: "#E5ECF6",
                  width: 0.5,
                },
                pattern: {
                  fillmode: "overlay",
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: "bar",
            },
          ],
          scattergeo: [
            {
              type: "scattergeo",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scatterpolar: [
            {
              type: "scatterpolar",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          histogram: [
            {
              marker: {
                pattern: {
                  fillmode: "overlay",
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: "histogram",
            },
          ],
          scattergl: [
            {
              type: "scattergl",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scatter3d: [
            {
              type: "scatter3d",
              line: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scattermapbox: [
            {
              type: "scattermapbox",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scatterternary: [
            {
              type: "scatterternary",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          scattercarpet: [
            {
              type: "scattercarpet",
              marker: {
                colorbar: {
                  outlinewidth: 0,
                  ticks: "",
                },
              },
            },
          ],
          carpet: [
            {
              aaxis: {
                endlinecolor: "#2a3f5f",
                gridcolor: "white",
                linecolor: "white",
                minorgridcolor: "white",
                startlinecolor: "#2a3f5f",
              },
              baxis: {
                endlinecolor: "#2a3f5f",
                gridcolor: "white",
                linecolor: "white",
                minorgridcolor: "white",
                startlinecolor: "#2a3f5f",
              },
              type: "carpet",
            },
          ],
          table: [
            {
              cells: {
                fill: {
                  color: "#EBF0F8",
                },
                line: {
                  color: "white",
                },
              },
              header: {
                fill: {
                  color: "#C8D4E3",
                },
                line: {
                  color: "white",
                },
              },
              type: "table",
            },
          ],
          barpolar: [
            {
              marker: {
                line: {
                  color: "#E5ECF6",
                  width: 0.5,
                },
                pattern: {
                  fillmode: "overlay",
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: "barpolar",
            },
          ],
          pie: [
            {
              automargin: true,
              type: "pie",
            },
          ],
        },
        layout: {
          autotypenumbers: "strict",
          colorway: [
            "#636efa",
            "#EF553B",
            "#00cc96",
            "#ab63fa",
            "#FFA15A",
            "#19d3f3",
            "#FF6692",
            "#B6E880",
            "#FF97FF",
            "#FECB52",
          ],
          font: {
            color: "#2a3f5f",
          },
          hovermode: "closest",
          hoverlabel: {
            align: "left",
          },
          paper_bgcolor: "white",
          plot_bgcolor: "#E5ECF6",
          polar: {
            bgcolor: "#E5ECF6",
            angularaxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
            radialaxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
          },
          ternary: {
            bgcolor: "#E5ECF6",
            aaxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
            baxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
            caxis: {
              gridcolor: "white",
              linecolor: "white",
              ticks: "",
            },
          },
          coloraxis: {
            colorbar: {
              outlinewidth: 0,
              ticks: "",
            },
          },
          colorscale: {
            sequential: [
              [0.0, "#0d0887"],
              [0.1111111111111111, "#46039f"],
              [0.2222222222222222, "#7201a8"],
              [0.3333333333333333, "#9c179e"],
              [0.4444444444444444, "#bd3786"],
              [0.5555555555555556, "#d8576b"],
              [0.6666666666666666, "#ed7953"],
              [0.7777777777777778, "#fb9f3a"],
              [0.8888888888888888, "#fdca26"],
              [1.0, "#f0f921"],
            ],
            sequentialminus: [
              [0.0, "#0d0887"],
              [0.1111111111111111, "#46039f"],
              [0.2222222222222222, "#7201a8"],
              [0.3333333333333333, "#9c179e"],
              [0.4444444444444444, "#bd3786"],
              [0.5555555555555556, "#d8576b"],
              [0.6666666666666666, "#ed7953"],
              [0.7777777777777778, "#fb9f3a"],
              [0.8888888888888888, "#fdca26"],
              [1.0, "#f0f921"],
            ],
            diverging: [
              [0, "#8e0152"],
              [0.1, "#c51b7d"],
              [0.2, "#de77ae"],
              [0.3, "#f1b6da"],
              [0.4, "#fde0ef"],
              [0.5, "#f7f7f7"],
              [0.6, "#e6f5d0"],
              [0.7, "#b8e186"],
              [0.8, "#7fbc41"],
              [0.9, "#4d9221"],
              [1, "#276419"],
            ],
          },
          xaxis: {
            gridcolor: "white",
            linecolor: "white",
            ticks: "",
            title: {
              standoff: 15,
            },
            zerolinecolor: "white",
            automargin: true,
            zerolinewidth: 2,
          },
          yaxis: {
            gridcolor: "white",
            linecolor: "white",
            ticks: "",
            title: {
              standoff: 15,
            },
            zerolinecolor: "white",
            automargin: true,
            zerolinewidth: 2,
          },
          scene: {
            xaxis: {
              backgroundcolor: "#E5ECF6",
              gridcolor: "white",
              linecolor: "white",
              showbackground: true,
              ticks: "",
              zerolinecolor: "white",
              gridwidth: 2,
            },
            yaxis: {
              backgroundcolor: "#E5ECF6",
              gridcolor: "white",
              linecolor: "white",
              showbackground: true,
              ticks: "",
              zerolinecolor: "white",
              gridwidth: 2,
            },
            zaxis: {
              backgroundcolor: "#E5ECF6",
              gridcolor: "white",
              linecolor: "white",
              showbackground: true,
              ticks: "",
              zerolinecolor: "white",
              gridwidth: 2,
            },
          },
          shapedefaults: {
            line: {
              color: "#2a3f5f",
            },
          },
          annotationdefaults: {
            arrowcolor: "#2a3f5f",
            arrowhead: 0,
            arrowwidth: 1,
          },
          geo: {
            bgcolor: "white",
            landcolor: "#E5ECF6",
            subunitcolor: "white",
            showland: true,
            showlakes: true,
            lakecolor: "white",
          },
          title: {
            x: 0.05,
          },
          mapbox: {
            style: "light",
          },
        },
      },
    },
  },
};
export default function ProjectAnalysis({ visible }) {
  const { projectData } = useProjectData();

  const getPolygonGeoJson = async () => {
    const cadastralNumbersArray =
      projectData.projectCadastralRecords.cadastralRecords.map(
        (item) => item.cadastralNumber
      );

    if (cadastralNumbersArray.length > 0) {
      let polygonGeoJson = await getPolygonByCadastralNumber(
        cadastralNumbersArray
      ); // Llamada a la función getData
      const predialData = await getPredialDataByCadastralNumber(
        cadastralNumbersArray
      ); // Llamada a la función getData
      const predialData2 = await getPredialData2ByCadastralNumber(
        cadastralNumbersArray
      ); // Llamada a la función getData

      if (polygonGeoJson) {
        polygonGeoJson.features = polygonGeoJson.features.map(
          (feature, index) => {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                ...predialData[feature.properties.CODIGO],
                ...predialData2[feature.properties.CODIGO],
              },
            };
          }
        );
      }

      return polygonGeoJson;
    }

    alert(
      "No hay datos disponibles para descargar (El proyecto no tiene información predial asociada)"
    );
    return null;
  };

  const handleDownloadGeoJsonButton = async () => {
    const geoJsonPolygonsObject = await getPolygonGeoJson();
    if (geoJsonPolygonsObject) {
      const finalObject = {
        projectID: projectData.projectInfo.id,
        geoJson: geoJsonPolygonsObject,
      };
      generateJSONFile(finalObject, projectData.projectInfo.id);
    }
  };

  return (
    <div className="row row-cols-1  g-4">
      <Card>
        <Card.Header title="Analisis" sep={true} />
        <Card.Body>
          <div className="d-flex align-items-center">
            <p className="mb-0 me-4">Descargar datos de poligonos:</p>
            <Button className="" onClick={handleDownloadGeoJsonButton}>
              JSON File
            </Button>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header title="Análisis Comparativo de Áreas" sep={true} />
        <Card.Body>
          <div class="d-flex justify-content-center align-items-center mb-24">
            <div class="d-flex flex-column w-5/6 align-items-center gap-4">
              <h4>Evolución de áreas</h4>
              <BarGraphComponent infoBarGraph={data.graphJSON_barras} />
              <h4 class="pt-4">Diagrama de Sankey - Cambios en Vegetación</h4>
              <SankeyGraphComponent infoSankeyGraph={data.graphJSON_sankey} />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
