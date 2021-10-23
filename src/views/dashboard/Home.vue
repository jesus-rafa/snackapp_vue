<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-sheet elevation="10">
          <v-card class="mx-auto" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title>
                  <div class="display-2 mb-4">Bienvenido!</div>
                </v-list-item-title>
                <v-list-item-title class="text-h4 mb-2">
                  <div class="logo">
                    <strong>@Eventos App</strong>
                  </div>
                </v-list-item-title>
                Con esta aplicación podrás administrar todo tipo de eventos de
                una forma muy práctica y fácil.
              </v-list-item-content>

              <v-list-item-avatar tile size="80" color="grey">
                <v-img src="@/assets/logo3.jpg" />
              </v-list-item-avatar>
            </v-list-item>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-sheet elevation="10">
          <v-carousel v-model="model" height="auto" hide-delimiters>
            <v-carousel-item
              v-for="(item, i) in items"
              :key="i"
              :src="item.src"
              reverse-transition="fade-transition"
              transition="fade-transition"
            >
              <v-row
                class="fill-height"
                align="end"
                justify="center"
                style="margin: 0"
              >
                <div class="text-h2" style="background: goldenrod;">
                  {{ tittles[model + 1] }}
                </div>
              </v-row>
            </v-carousel-item>
          </v-carousel>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      tittles: [
        "",
        "Crea tu evento",
        "Administra tu evento",
        "Agrega participantes",
        "Crea pedidos",
        "Consulta tus eventos",
        "Gestiona ordenes y pagos"
      ],
      model: 0,
      items: [
        {
          src: "https://i.ibb.co/GPkC3BD/Crea-Evento.png"
        },
        {
          src: "https://i.ibb.co/xJFPQYC/Admin-Event.png"
        },
        {
          src: "https://i.ibb.co/6Jvv5Tc/Admin-Event1.png"
        },
        {
          src: "https://i.ibb.co/LCG31Hr/Crear-Pedido.png"
        },
        {
          src: "https://i.ibb.co/xYZ1mtR/Events-En-Los-Que-Participas.png"
        },
        {
          src: "https://i.ibb.co/cNt2H1v/Ver-Lista-Pedidos.png"
        }
      ],
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De"
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
      headers: [
        {
          sortable: false,
          text: "ID",
          value: "id"
        },
        {
          sortable: false,
          text: "Name",
          value: "name"
        },
        {
          sortable: false,
          text: "Salary",
          value: "salary",
          align: "right"
        },
        {
          sortable: false,
          text: "Country",
          value: "country",
          align: "right"
        },
        {
          sortable: false,
          text: "City",
          value: "city",
          align: "right"
        }
      ],

      tabs: 0,
      tasks: {
        0: [
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: true
          },
          {
            text:
              "Lines From Great Russian Literature? Or E-mails From My Boss?",
            value: false
          },
          {
            text:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: false
          },
          {
            text: "Create 4 Invisible User Experiences you Never Knew About",
            value: true
          }
        ],
        1: [
          {
            text:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: true
          },
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: false
          }
        ],
        2: [
          {
            text:
              "Lines From Great Russian Literature? Or E-mails From My Boss?",
            value: false
          },
          {
            text:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: true
          },
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: true
          }
        ]
      },
      list: {
        0: false,
        1: false,
        2: false
      }
    };
  },

  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    }
  }
};
</script>
<style scoped>
.logo {
  color: #f50057;
}
</style>
