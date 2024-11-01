interface Validatable{
value:string | number;
required?:boolean;
minLength?:number;
maxLength?:number;
min?:number;
max?:number;
}

function validate(validatableInput:Validatable){
let isValid=true;
if(validatableInput.required){
    isValid=isValid && validatableInput.value.toString().trim().length!==0
}
if(validatableInput.minLength && typeof validatableInput.value==="string"){
    isValid=isValid && validatableInput.value.trim().length>=validatableInput.minLength;
}
if(validatableInput.maxLength && typeof validatableInput.value==="string"){
    isValid=isValid && validatableInput.value.trim().length<=validatableInput.maxLength;
}
if(validatableInput.min && typeof validatableInput.value==="number"){
    isValid=isValid && validatableInput.value>=validatableInput.min;
}
if(validatableInput.max && typeof validatableInput.value==="number"){
    isValid=isValid && validatableInput.value<=validatableInput.max;
}
return isValid;
}
enum ProjectStatus{
    active,
    finished
}
//class type
class Project{
    constructor(
        public id:string,
        public title:string,
        public descrption:string,
        public people:number,
        public status:ProjectStatus)
        {
         
        }
}

type Listener=(item:Project[])=>void;
// class state
class ProjectState{
    private listener:Listener[]=[]
    private projects:Project[]=[];
    private static instence:ProjectState
    constructor(){

    }
    static getInstence(){
        if(this.instence){
            return this.instence
        }
        this.instence=new ProjectState();
        return this.instence
    }
    addListener(listenrFn:Listener){
    this.listener.push(listenrFn);
    }
    addProject(title:string,description:string,people:number){
     const newProject:Project={
        id:Math.random().toString(),
        title:title,
        descrption:description,
        people:people,
        status:ProjectStatus.active
     }
     this.projects.push(newProject)
     for(const listenerFn of this.listener){
      listenerFn(this.projects.slice());
     }
    }

}
const projectState=ProjectState.getInstence();
class ProjectList{
    templateElement:HTMLTemplateElement;
    hostElement:HTMLDivElement;
    element:HTMLElement;
    assignedProject:Project[]=[];
constructor(private type:'active' | 'finished'){
    this.templateElement=<HTMLTemplateElement>document.getElementById("project-list")!;
    this.hostElement=document.getElementById("app")! as HTMLDivElement;
    this.assignedProject=[]
    const importNode=document.importNode(this.templateElement.content,true)
    this.element=importNode.firstElementChild as HTMLElement;
    this.element.id=`${this.type}-projects`;
    projectState.addListener((projects:any[])=>{
        this.assignedProject=projects;
        this.renderProject();
    })
    this.attache();
    this.renderedContent();
}
private renderProject(){
const listEl=document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
for(const prjItem of this.assignedProject){
    const listItem=document.createElement("li");
    listItem.textContent=prjItem.title;
    listEl.appendChild(listItem)
}
}
private renderedContent(){
    const listId=`${this.type}-projects-list`;
    this.element.querySelector("ul")!.id=listId;
    this.element.querySelector("h2")!.textContent=this.type.toUpperCase() + 'PROJECTS';

}
private attache(){
this.hostElement.insertAdjacentElement("beforeend",this.element)
}
}

class ProjectInputs{
    templateElement:HTMLTemplateElement;
    hostElement:HTMLDivElement;
    element:HTMLFormElement;
    TitleElementInput:HTMLInputElement;
    descriptionElementInput:HTMLInputElement;
    peopleElementInput:HTMLInputElement;
    constructor(){
        this.templateElement=<HTMLTemplateElement>document.getElementById("project-input")!;
        this.hostElement=document.getElementById("app")! as HTMLDivElement;
        const importNode=document.importNode(this.templateElement.content,true)
        this.element=importNode.firstElementChild as HTMLFormElement;
        this.element.id="user-input";
        this.TitleElementInput = this.element.querySelector("#title")! as HTMLInputElement;
        this.descriptionElementInput = this.element.querySelector("#description")! as HTMLInputElement;
        this.peopleElementInput = this.element.querySelector("#people")! as HTMLInputElement;
        this.configure();
        this.attach();
    }
    private clearInputs(){
        this.TitleElementInput.value=""; 
        this.descriptionElementInput.value=""; 
        this.peopleElementInput.value=""; 
    }
    private gatherUsreInputs():[string,string,number] | void{
     const enterdTitle=this.TitleElementInput.value ;
     const enterdDescription=this.descriptionElementInput.value;
     const enterdpeople=this.peopleElementInput.value;
     const titleValidatable:Validatable={
        value:enterdTitle,
        required:true,
     }
     const descriptionValidatable:Validatable={
        value:enterdDescription,
        required:true,
        minLength:5
     }
     const peopleValidatable:Validatable={
        value:+enterdpeople,
        required:true,
        min:2,
        max:5
     }
     if(!validate(titleValidatable) || 
     !validate(descriptionValidatable) || 
     !validate(peopleValidatable)){
       alert("wrong")
       return;
     }else{
        return [enterdTitle,enterdDescription,+enterdpeople]
     }
     
    }
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput=this.gatherUsreInputs();
        if(Array.isArray(userInput)){
            const [title,desc,people]=[...userInput];
            projectState.addProject(title,desc,people)
            console.log(userInput)
            this.clearInputs();
        }
    }
    
    private configure(){
        this.element.addEventListener("submit",this.submitHandler.bind(this))
    }
    private attach(){
        this.hostElement.insertAdjacentElement("afterbegin",this.element)
    }
}

const inputProject=new ProjectInputs();
const activeProjectList=new ProjectList("active");
const finichedrojectList=new ProjectList("finished");