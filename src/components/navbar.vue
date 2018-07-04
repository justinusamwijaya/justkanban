<template>
    <nav>
        KanbanJustin
    </nav>
</template>
<script>
export default {
    name:'navbar',
    data(){
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
$primaryColor:#01cfc2;
    nav{
        color:$primaryColor;
        font-size: 30px;
        display:flex;
        justify-content: center;
        align-items:center;
        height:50px;
        margin-bottom: 50px;
        border-bottom: .5px solid rgba(0, 247, 255, 0.5);
    }
</style>
