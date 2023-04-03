<template>
  <div class="test">
    <h1> {{ quizTitle }} </h1>
    <!-- <div class="settings" v-show="showSettings">
      <h4> Add logic</h4>
      <div class="settings__info">
        <p><b>IF </b> {{ quizText }} </p>
        <p><b style="margin-right: 10px">IS</b>
          <select class="" name="" v-model="sourceItemId">
            <option value=''></option>
            <option :value='item.id' v-for="(item, i) in this.quizAnswers" :key="i">{{ item.answer_text}}</option>
          </select>
        </p>
        <p><b>THEN</b> jump to</p>
        <select class="" name="" v-model="targetItemId">
          <option value=''></option>
          <option :value='item.id' v-for="(item, idx) in this.quizInfo.questions" :key="idx">{{ item.question_text}}</option>
          <option :value='item.id' v-for="(item, index) in this.quizInfo.end_form" :key="index">{{ item.title}}</option>

        </select>
      </div>
      <div class="settings__buttons">
        <button class="settings__btn" @click="saveLogic">Save</button>
        <button class="settings__btn" @click="cansel">Cancel</button>
      </div>
    </div> -->
    <VueFlow v-model="nodeArr" class="basicflow" :default-zoom="1" :min-zoom="0.2" :max-zoom="4">
      <!-- <Background pattern-color="#aaa" gap="8" /> -->
      <!-- <MiniMap /> -->
      <Controls />
      <!-- <template #connection-line="props">
        <CustomConnectionLine v-bind="props" />
      </template> -->

      <div class="controls">
        <button style="" class="btn-save" @click="saveChanges">Зберегти</button>
        <button style="" class="btn-delete" v-if="focusOnEdge" @click="deleteEdge">Видалити зв'язок</button>
        <button style="" class="btn-cansel" v-if="focusOnEdge" @click="focusOnEdge = false">Скасувати</button>


        <!-- <button style="background-color: #113285; color: white" @click="resetTransform">reset transform</button>
        <button style="background-color: #6f3381; color: white" @click="updatePos">update positions</button>
        <button
          :style="{ backgroundColor: dark ? '#FFFFFB' : '#1C1C1C', color: dark ? '#1C1C1C' : '#FFFFFB' }"
          @click="toggleClass"
        >
          toggle {{ dark ? 'light' : 'dark' }}
        </button>
        <button @click="logToObject">log toObject</button> -->
      </div>
    </VueFlow>
    <div class="">
      <!-- {{ nodeArr }} -->
    </div>
  </div>
</template>



<script setup>
  /* eslint-disable */
  import { Background, Controls, MiniMap, VueFlow, isNode, useVueFlow, Position, MarkerType  } from '@braks/vue-flow'
  import { ref, onMounted } from 'vue'
  // import { initialElements } from './initial-elements.js'
  import axios from 'axios'
  // import CustomConnectionLine from './CustomConnectionLine.vue'


  const { onPaneReady, onNodeDragStop, onConnect, addEdges, setTransform, toObject } = useVueFlow()

  // const elements = ref(initialElements)

  onPaneReady(({ fitView }) => {
    fitView()
  })

  onNodeDragStop((e) => console.log('drag stop', e))

  onConnect((params) => addEdges([params]))

  const dark = ref(false)

  const updatePos = () =>
    elements.value.forEach((el) => {
      if (isNode(el)) {
        el.position = {
          x: Math.random() * 400,
          y: Math.random() * 400,
        }
      }
    })

  const logToObject = () => console.log(toObject())

  const resetTransform = () => setTransform({ x: 0, y: 0, zoom: 1 })

  const toggleClass = () => {
    dark.value = !dark.value
    elements.value.forEach((el) => (el.class = dark.value ? 'dark' : 'light'))
  }


  // https://a.webs.li/api/quizzes/18
</script>
<script>
  export default {
    data() {
      return {
        quizInfo: '',
        schema: {
          id: 1,
          nodes: [
            {id: 101, title: 'first node', description: 'desc for first node'},
            {id: 102, title: 'second node', description: 'desc for second node'},
            {id: 103, title: 'third node', description: 'desc for third node'},
            {id: 104, title: 'fourth node', description: 'desc for fourth node'},
            {id: 105, title: 'fifth node', description: 'desc for fifth node'},

          ]
        },
        nodeArr: [],
        quizTitle: '',
        newArr: [],
        connections: [],
        answers: [],
        endForms: [],
        finallArr: [],
        createdNodes: [],
        newAnswers: [],
        newConnections: [],
        createdQuestion: {
          questionText: '',
          createdAnswers: [
            {

            }
          ]
        },
        xCoor: 150,
        yCoor: 50,
        showSettings: false,
        quizText: '',
        quizAnswers: [],
        targetItemId: '',
        sourceItemId: '',
        selectedQuestionId: Number,
        selectedQuestionColor: '',
        focusOnEdge: false,
        selectedEdgeInfo: {},
        deleteArr: [],


      }
    },
    beforeMount() {
      this.getQuiz().then(res => {
        this.quizInfo = res.data
        this.quizTitle = this.quizInfo.name;
      })
      .then( res => {
        this.showQuisFlow()
      }); // end then
    },
    methods: {
       getQuiz() {
        return new Promise((res, rej) => {
          axios.get('https://a.webs.li/api/quizzes/18')
          // axios.get('https://a.webs.li/api/quizzes/65')

          .then(function (response) {
            res({
              data: response.data
            })
          })
          .catch(function (error) {
            rej(console.log(error))
          });
        });
      },

      generateRandomColorHex() {
        // return "#" + ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6);
        return "#" + ("00000" + Math.floor(Math.random() * Math.pow(20, 6)).toString(16)).slice(-6);

      },
      showQuisFlow() {
        this.quizInfo.questions.forEach((item, i, arr) => {
          let type = 'output';
          let sourcePosition = Position.Right;
          let targetPosition = Position.Left;
          let xCoorForNodes = this.xCoor;
          let randomColor = this.generateRandomColorHex();
          let typeColor = '';
          let answersSize = 1;
          let questionContainerSize = 50;
          let imageQuestion = 1;

          switch (item.type) {
            case 1:
              typeColor = '#edffd0';
              break;
            case 2:
              typeColor = '#ccfdff';
              break;
            case 3:
              typeColor = '#ffe7b6';
              break;
            case 4:
              typeColor = '#b6ceff';
              break;
            case 5:
              typeColor = '#ffb6b6';
              break;
            case 6:
              typeColor = '#ffcbe7';
              break;
            case 7:
              typeColor = '#edcbff';
              break;
            case 8:
              typeColor = '#fffbcb';
              break;
            default:

          }
          if (i == 0) {
            type = 'input';
            targetPosition = '';
          }
          let question = '';
          if (item.description != null) {
            question = ` ${item.description}`
          }
          if (i == 0) {
            this.yCoor = 220;
            xCoorForNodes = 50;
          } else if ((i%2) == 0) {
            this.yCoor = 500;
          }else {
            this.yCoor = 1;
          }
          // item.answers.forEach((itemAnswer, e) => {
          //   let frontend = JSON.parse(itemAnswer.frontend);
          // }
          if (item.type == 2) {
            answersSize = 2.5;
            questionContainerSize = 125;
          }
          if (item.type == 2 && ((i%2) !== 0)) {
            imageQuestion *= -250;

          }

          /// add this, after add fields x and y for every question, for question positions


          // if (item.position.x !== null && item.position.y !== null) {
          //   this.newArr.push({
          //     id: `${item.id}`,
          //     label: `<b>${i+1}.</b> ${item.question_text}${question}`,
          //     type: type,
          //     position: {x: item.position.x, y: item.position.y},
          //     class: 'question',
          //     style: { height: `${item.answers.length*questionContainerSize + 100}px`, '--bg': `${typeColor}` },
          //     sourcePosition: sourcePosition,
          //     targetPosition: targetPosition,
          //
          //     events: {
          //       click: () => {
          //         this.nodeClick(item, randomColor)
          //       }
          //     }
          //   })
          // } else {
          //   this.newArr.push({
          //     id: `${item.id}`,
          //     label: `<b>${i+1}.</b> ${item.question_text}${question}`,
          //     type: type,
          //     position: {x: (xCoorForNodes), y: this.yCoor*imageQuestion},
          //     class: 'question',
          //     style: { height: `${item.answers.length*questionContainerSize + 100}px`, '--bg': `${typeColor}` },
          //     sourcePosition: sourcePosition,
          //     targetPosition: targetPosition,
          //
          //     events: {
          //       click: () => {
          //         this.nodeClick(item, randomColor)
          //       }
          //     }
          //   })
          // }
          this.newArr.push({
            id: `${item.id}`,
            label: `<b>${i+1}.</b> ${item.question_text}${question}`,
            type: type,
            position: {x: (xCoorForNodes), y: this.yCoor*imageQuestion},
            class: 'question',
            style: { height: `${item.answers.length*questionContainerSize + 100}px`, '--bg': `${typeColor}` },
            sourcePosition: sourcePosition,
            targetPosition: targetPosition,

            events: {
              click: () => {
                this.nodeClick(item, randomColor)
              }
            }
          })

          type = 'output';
          this.xCoor +=  270;
          targetPosition = Position.Left;
          item.answers.forEach((itemAnswer, e) => {
            let frontend = JSON.parse(itemAnswer.frontend);
            let typeAnswers = 'input';
            let labelImage = `${itemAnswer.answer_text}`;
            if (item.type == 2) {
              labelImage = `<div class="label__image">${itemAnswer.answer_text}</div>`
            }
            this.answers.push({
              id: `${itemAnswer.id}`,
              label: labelImage,
              position: {x: 10, y: ((e*answersSize)*52 + 80)},
              class: 'answer',
              extent: 'parent',
              parentNode: `${item.id}`,
              type: typeAnswers,
              sourcePosition: sourcePosition,
              style: { height: `${answersSize*40}px`, borderColor: `${randomColor}`, boxShadow: `0 0 4px ${randomColor}`,  backgroundImage: `url(${frontend.image})`},
            })

            if (itemAnswer.leads_to_question_id !== null) {
              this.createConnection(itemAnswer.id, itemAnswer.leads_to_question_id, randomColor, item.id)
            } else if (frontend.hasOwnProperty('leads_to_ending_id') && frontend.leads_to_ending_id != null){
                this.createConnection(itemAnswer.id, frontend.leads_to_ending_id, randomColor)
              } else {
                if ( i < (arr.length - 2)) {
                  let settings = JSON.parse(arr[i+1].settings);
                  if ( settings.conditions.length > 0 && settings.conditions[0].hasOwnProperty('hidden') && settings.conditions[0].hidden == true) {
                    this.createConnection(itemAnswer.id, arr[i+2].id, randomColor)
                  } else {
                    this.createConnection(itemAnswer.id, arr[i+1].id, randomColor)
                  }
                } else if (i == arr.length - 2){
                    let settings = JSON.parse(arr[i+1].settings);
                    if ( settings.conditions.length > 0 && settings.conditions[0].hasOwnProperty('hidden') && settings.conditions[0].hidden == true) {
                      this.createConnection(itemAnswer.id, this.quizInfo.end_form[0].id, randomColor)
                    } else {
                      this.createConnection(itemAnswer.id, arr[i+1].id, randomColor)
                    }
                } else if (i == arr.length - 1){
                  this.createConnection(itemAnswer.id, this.quizInfo.end_form[0].id, randomColor)

                }
              }
          });
          this.yCoor = 250;
        }); // foreach ends

        this.quizInfo.end_form.forEach((itemEnd, i) => {
          this.endForms.push({
            id: `${itemEnd.id}`,
            label: `${itemEnd.title}`,
            type: 'output',
            class: 'ending',
            position: {x: this.xCoor + 200, y: (this.yCoor + i*150)},
            targetPosition: Position.Left
          })
        });
        this.finallArr = this.newArr.concat(this.answers, this.connections, this.endForms);
        this.nodeArr = this.finallArr;

      },
      createConnection(sourceId, targetId, color) {
        this.connections.push({
          id: `e${sourceId}-${targetId}`,
          label: '',
          source: `${sourceId}`,
          target: `${targetId}`,
          markerEnd: {
            type: 'arrowclosed',
            color: color

          },
          style: { stroke: `${color}`, strokeWidth: '1.7'},
          events: {
            click: () => {
              this.edgeClick(sourceId, targetId)
            }
          }
        })
      },
      nodeClick(item, randomColor) {
        this.showSettings = !this.showSettings;
        this.quizText = item.question_text;
        this.quizAnswers = item.answers;
        this.selectedQuestionId = item.id;
        this.selectedQuestionColor = randomColor;


      },
      edgeClick(source, target) {
        this.focusOnEdge = true;
        this.selectedEdgeInfo = {
          source: source,
          target: target,
        }

      },
      deleteEdge() {
        this.deleteArr.push(this.selectedEdgeInfo);
        this.nodeArr.forEach((item, i) => {
          if( item.id === `e${this.selectedEdgeInfo.source}-${this.selectedEdgeInfo.target}`) {
            this.nodeArr = this.nodeArr.splice(i, 1)
          }
        });
        this.newConnections.forEach((item, i) => {
          if( item.source === this.selectedEdgeInfo.source && item.target === this.selectedEdgeInfo.target) {
            this.newConnections = this.newConnections.splice(i, 1)
          }
        });
        this.focusOnEdge = false;

      },
      saveLogic() {
        let sourceForEdge = this.sourceItemId;
        let targetForEdge = this.targetItemId
        this.nodeArr.push({
          id: `e${this.sourceItemId}-${this.targetItemId}`,
          source: `${this.sourceItemId}`,
          target: `${this.targetItemId}`,
          style: { stroke: `${this.selectedQuestionColor}`, strokeWidth: '1.7'},
          markerEnd: {
            type: 'arrowclosed',
            color: `${this.selectedQuestionColor}`
          },
          events: {
            click: () => {
              this.edgeClick(sourceForEdge, targetForEdge)
            }
          }
        })
        this.newConnections.push({
          source: this.sourceItemId,
          target: this.targetItemId,

        })
        this.showSettings = false;
        this.sourceItemId = '';
        this.targetItemId = '';

      },
      cansel() {
        console.log('cansel current logic')
        this.showSettings = false;
        console.log(this.nodeArr)
      },
      saveChanges() {

        let endFormsId = [];
        this.endForms.forEach((item) => {
          endFormsId.push(parseInt(item.id));
        });

        this.deleteArr.forEach((itemDelete, i) => {
          this.quizInfo.questions.forEach((q) => {
                q.answers.forEach((a) => {
                  if(a.id === itemDelete.source) {
                    let frontend = JSON.parse(a.frontend);
                    if (endFormsId.includes(itemDelete.target)) {
                      frontend.leads_to_ending_id = null;
                      a.frontend = JSON.stringify(frontend);
                    } else {
                      a.leads_to_question_id = null;
                    }
                  }
                });
            });
        });
        this.newConnections.forEach((itemConnection) => {
          this.quizInfo.questions.forEach((q) => {
                q.answers.forEach((a) => {
                  if(a.id === itemConnection.source) {
                    let frontend = JSON.parse(a.frontend);
                    if (endFormsId.includes(itemConnection.target)) {
                      frontend.leads_to_ending_id = itemConnection.target;
                      a.frontend = JSON.stringify(frontend);
                    } else {
                      a.leads_to_question_id = itemConnection.target;
                    }
                  }
                });
            });
        });

        let tempArr = [];
        this.nodeArr.forEach((item, i) => {
          if (item.class === 'question' || item.class === 'ending'){
            tempArr.push({
              x: item.position.x,
              y: item.position.y
            })
          }
        });
        console.log(tempArr)

      }
    }

  }
 </script>
<style>
  @import 'https://cdn.jsdelivr.net/npm/@braks/vue-flow@0.4.40/dist/style.css';
  @import 'https://cdn.jsdelivr.net/npm/@braks/vue-flow@0.4.40/dist/theme-default.css';

  html,
  body,
  #app {
  margin: 0;
  height: 100%;
  }
  .test {
    height: 100%;
  }
  #app {

    font-family: 'JetBrains Mono', monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: #eee;
  }

  .vue-flow__minimap {
    transform: scale(75%);
    transform-origin: bottom right;
  }
  .controls {
    align-items: flex-start;
  }
    .basicflow .vue-flow__node.dark{background:#1C1C1C;color:#fffffb}.basicflow .controls{position:absolute;left:10px;top:10px;z-index:4;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.basicflow .controls button{padding:5px;border-radius:5px;font-weight:500;-webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);box-shadow:0 5px 10px #0000004d;cursor:pointer}.basicflow .controls button:hover{opacity:.8;transform:scale(105%);transition:.25s all ease}

  .btn-save,
  .btn-cansel,
  .btn-delete {
    border: 0;
    padding: 10px 15px!important;
    background-color: #4c75e6;
    color: white;
    margin-left: 20px;
  }
  .btn-delete {
    background-color: #d6160f;
  }
  .btn-cansel {
    background-color: #828ead;
  }
  .question {
    border-color: #0b38f7;
    border-color: #e8e5e5;
    box-shadow: 0 0 20px #ababab;
    width: 200px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    padding-top: 15px;

  }
  .question::before {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 60px;
    height: 20px;
    z-index: -1;
    border-radius: 10px 10px 0 0 ;
    background-color: var(--bg);
    left: 0;
  }
.question b {
  font-size: 20px;
}
  .answer {
    border-color: #b4b8f9;
    background-color: #ffffff;
    border-radius: 5px;
    width: 180px;
    height: 40px;
    background-position: center;
    background-size: cover;

    }

    .answer .label__image {
      display: block;
      position: absolute;
      z-index: 100;
      bottom: 0;
      width: calc(100% - 10px);
      left: 0;
      background: #fff;
      background: rgba(255, 255, 255, 0.8);
      padding: 5px;
      border-radius: 0 0 5px 5px;

    }
    .vue-flow__edge-default.selected path{
      stroke-width: 5!important;
    }

  .ending {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 20px #ababab;
    background-color: rgba(245, 234, 202, 1);
  }
  .settings {
    border: 1px solid silver;
    border-radius: 4px;
    width: 450px;
    padding: 20px;
    padding-top: 0;
    text-align: left;
    background: #fff;
    position: absolute;
    z-index: 30;
    top: 40%;
    left: 5%;
    color: #48465b;
  }
  .settings h4 {
    font-weight: 500;
    font-size: 1.3rem;
    color: #48465b;
    border-bottom: 1px solid #ebedf2;
  }
  .settings__info b{
    font-weight: 700;
    font-weight: bold;
    color: #48465b;
  }
  .settings__info p {
    color: #69686f;
  }
  .settings__info select{
    padding: 5px;
    border-radius: 3px;
    border: 1px solid silver;
    width: 300px;
    outline: none;
  }
  .settings__info option {
    font-size: 14px;
  }
  .settings__buttons {
    text-align: right;
    margin-top: 20px;
  }
  .settings__btn {
    border: 0;
    background: #5d78ff;
    color: #fff;
    padding: 0.65rem 1rem;
    font-size: 14px;
    border-radius: 3px;
    margin-left: 10px;
    cursor: pointer;
    transition: all .5s ease;
  }
  .settings__btn:hover {
    background-color: #264aff;
  }

</style>
