<template>
  <li @click="toggleShowTask()" class="wrapper" :id="task.id">
    <div class="hideDetail" v-if="!showTask">
      {{Name}} ({{Priority}})
    </div>
    <div class="showDetail" v-else>
      <div v-if="!editMode">
        <h3>Name: {{Name}}</h3> 
        <p>Description: {{Description}}</p> 
        <p>Priority: {{Priority}}</p>
        <button @click="editMode = !editMode">edit</button>
        <button @click="deleteList()">delete</button>
      </div>
      <form v-if="editMode" @submit="editList()">
        <input v-model="Name" type="text" ref="title">
        <input v-model="Description" type="text">
        <input v-model="Priority" type="number" ref="Prior">
        <button type="submit">edit</button>
        <button type="button" @click="editMode = !editMode">cancel</button>
      </form>
    </div>
  </li>
</template>

<script>
import { database } from '@/firebase.js'
export default {
  name:'list',
  props:['task','status'],
  data(){
    return {
      showTask:false,
      Name:this.task.Name,
      editMode:false,
      Description:this.task.Description,
      Priority:this.task.Priority
    }
  },
  created(){
  },
  methods:{
    editList(){
      let { task, Name, Description, Priority, status } = this
      let errors = 0
      if(!Name){
        this.$refs.title.style.border="1px red solid"
        errors++
      }
      if(!Priority){
        this.$refs.Prior.style.border="1px red solid"
        errors++
      }
      if(errors) return
      let newList = {
        Name,
        Description,
        Priority,
        id:task.id,
      }
      console.log(newList)
      let self = this
      database(status + '/' + task.id).set(newList,function(){
        self.editMode = false
      })
    },
    toggleShowTask(){
      if(!this.editMode) this.showTask = !this.showTask
    },
    deleteList(){
      let { task, status } = this
      database(status + '/' + task.id).remove()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$primaryColor : #01cfc2;
input{
  width: 100%;
  text-align:center;
  margin-bottom: 5px;
  background:none;
  border:0;
  border-bottom: 1px solid rgba(255,255,255,.7);
  color:white;
  font-size:15px;
  padding: 5px;
  border-radius:3px;
  &:active, &:focus{
    outline: none;
  }
}
button{
  background:none;
  border:0;
  font-size:12px;
  cursor: pointer;
  color:rgba(255,255,255,.8);
  &:active, &:focus{
    outline:none;
  }
  &:hover{
    color:rgba(255,255,255,1);
  }
}
.wrapper{
  &:active, &:focus {
    outline:none;
  }
  .hideDetail{
    padding:20px;
    border-bottom:1px solid rgba(255,255,255,.4);
    border-radius:5px;
    cursor: pointer;
  }
  .showDetail{
    padding:20px;
    background-color:rgba(255,255,255,.3);
    min-height:150px;
    border-radius: 5px;
    cursor: pointer;
    h3{
      margin:0;
      padding:0;
    }
  }
}
</style>
