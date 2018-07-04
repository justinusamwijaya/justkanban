<template>
  <div>
    <div v-if="triggerTutorial" id="tutorial">
      1. drag and drop to change the status of the task <br>
      2. click on the task name to see the detail of the task
    </div>
    <div class="errorss">
      <div v-if="addProductToggle" v-for="(error,i) in errors" :key="i">
        {{error}}
      </div>
    </div>
    <div v-if="addProductToggle" class="panelAddList">
      <form @submit.prevent="addNewList()" method="post">
        add new List <button type="button" id="cancel" @click="addProductToggle = !addProductToggle">x</button>
        Name
        <input v-model="nameNewList" type="text">
        Priority
        <input v-model="priorNewList" type="number">
        Description
        <input v-model="descNewList" type="text">
        <button type="submit">add new list</button>
      </form>
    </div>
    <div @click="addProductToggle = !addProductToggle" v-if="addProductToggle" style="background-color:rgba(0,0,0,.7); position:fixed; height:100%; width:100%;top: 0;left:0;z-index:5881;">

    </div>
    <div v-drag-and-drop:options="dragdropoptions" class="drag-wrapper">
    <ul id="toDo" style="position:relative;">
      <h1>{{toDoLength}} To Do{{toDoLength > 1 ? 's':''}}</h1> <button class="addList" @click="addProductToggle = !addProductToggle">Add new List</button> 
      <list v-for="list in allList.toDo" :key="list.id" :task="list" :status="'toDo'" />
    </ul>
    <ul id="inProgress">
      <h1>{{inProgressLength}} In Progress{{inProgressLength > 1 ? 'es':''}}</h1>  
      <list v-for="list in allList.inProgress" :key="list.id" :task="list" :status="'inProgess'" />
    </ul>
      <ul id="review">
      <h1>{{reviewLength}} Review{{reviewLength > 1 ? 's':''}}</h1> 
      <list v-for="list in allList.review" :key="list.id" :task="list" :status="'review'" />
    </ul>
    <ul id="done">
      <h1>{{doneLength}} Done{{doneLength > 1 ? 's':''}}</h1>  
      <list v-for="list in allList.done" :key="list.id" :task="list" :status="'done'" />
    </ul>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import list from '@/components/list.vue'
import { database } from '@/firebase.js'
export default {
  name: 'home',
  components: {
    list
  },
  data(){
    return{
      dragdropoptions:{
        onDragstart(event){
          event.items[0].style.backgroundColor="white"
          event.items[0].style.color="#01cfc2"
          console.log(event.items[0].style)
        },
        onDragend(event){
          event.items[0].style.backgroundColor="#01cfc2"
          event.items[0].style.color="white"
        },
        onDrop(event){
          if(event.owner.id !== event.droptarget.id){
            database(event.owner.id + '/' + event.items[0].id).once('value',function(snapshot){
              database(event.droptarget.id + '/' + event.items[0].id).set(snapshot.val())
              database(event.owner.id + '/' + event.items[0].id).remove()
            })
          }
        }
      },
      allList:'',
      movedData:{},
      addProductToggle:false,
      nameNewList:'',
      descNewList:'',
      priorNewList:null,
      triggerTutorial:false,
      toDoLength: 0,
      doneLength: 0,
      inProgressLength: 0,
      reviewLength: 0,
      errors:[],
    }
  },
  created(){
    if(!localStorage.getItem('tutorial')){
      this.triggerTutorial = true
      localStorage.setItem('tutorial', true)
    }
    let self = this
    database().on('value',function(snapshot){
      self.allList = snapshot.val()
      self.toDoLength = snapshot.val().toDo ? Object.keys(snapshot.val().toDo).length : 0
      self.reviewLength = snapshot.val().review ? Object.keys(snapshot.val().review).length : 0
      self.inProgressLength = snapshot.val().inProgress ? Object.keys(snapshot.val().inProgress).length : 0
      self.doneLength = snapshot.val().done ? Object.keys(snapshot.val().done).length : 0
    })
  },
  methods:{
    addNewList:function(){
      let timestamp = new Date()
      timestamp = timestamp.getTime()
      let { errors, nameNewList, descNewList, priorNewList } = this
      errors.splice(0,errors.length)
      if(!nameNewList){
        errors.push('nama harus diisi')
      }
      if(!priorNewList){
        errors.push('prior point harus diisi!')
      }
      if(errors) return
      let newList = {
        Name:nameNewList,
        Description:descNewList,
        Priority:priorNewList,
        id:timestamp,
      }
      let self = this
      database('toDo/' + timestamp).set(newList,function(){
        self.errors = []
        self.addProductToggle = !self.addProductToggle
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$primaryColor : #01cfc2;
*{
  color: white;
}
#tutorial{
  color:$primaryColor;
}
.addList{
  color:rgba(255,255,255,.7);
  background:none;
  border:0;
  top:17px;
  right:65px;
  font-size: 15px;
  cursor: pointer;
  &:hover{
    color: rgba(255,255,255,1);
  }
  &:active,&:focus{
    outline:none;
  }
}
.errorss{
  position:absolute;
  top: 20px;
  z-index:6000;
  width:100%;
  text-align: center;
  font-size: 25px;
}
.panelAddList{
  padding: 10px;
  padding-top:30px;
  z-index: 5899;
  position:fixed;
  top:20%;
  right:30%;
  width: 40%;
  height: 60%;
  background-color:rgba(255,255,255,.4);
  text-align:center;
  border-radius:15px;
  border:1px solid rgba(255,255,255,.3);
  input{
    padding: 20px;
    width:90%;
    border:0;
    border-bottom:1px solid rgba(255,255,255,.3);
    margin-top: 10px;
    margin-bottom:10px;
    background-color:rgba(255,255,255,0);
    &:active, &:focus{
      outline:none;
    }
  }
  #cancel{
    position:absolute;
    top:3px;
    right:10px;
  }
  button{
    cursor: pointer;
    font-size: 15px;
    background:none;
    border:0;
    color:rgba(255,255,255,.5);
    &:focus, &:active{
      outline:none;
    }
    &:hover{
      color:rgba(255,255,255,.7);
    }
  }
}

.drag-wrapper {
  display: flex;
  justify-content: center;
}

ul {
  display: flex;
  flex-direction: column;
  padding: 3px;
  width: 300px;
  float:left;
  list-style-type:none;
  overflow-y:auto;
  border-radius:0.2em;
  background:$primaryColor;
  color:#555;
  margin-right: 5px;
  padding-bottom: 50px;
  &:active, &:focus {
    outline:none;
  }
}

/* drop target state */
ul[aria-dropeffect="move"] {
  border-color:white;
  background:#4ce0d4;
}

/* drop target focus and dragover state */
ul[aria-dropeffect="move"]:focus,
ul[aria-dropeffect="move"].dragover
{
  outline:none;
  background:#42c4b9;
}

/* draggable items */
li {
  display:block;
  list-style-type:none;
  margin:0 0 2px 0;
  padding:0.2em 0.4em;
  border-radius:0.2em;
  line-height:1.3;
}
</style>
