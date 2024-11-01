"use strict";
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.trim().length <= validatableInput.maxLength;
    }
    if (validatableInput.min && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["active"] = 0] = "active";
    ProjectStatus[ProjectStatus["finished"] = 1] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
//class type
class Project {
    constructor(id, title, descrption, people, status) {
        this.id = id;
        this.title = title;
        this.descrption = descrption;
        this.people = people;
        this.status = status;
    }
}
// class state
class ProjectState {
    constructor() {
        this.listener = [];
        this.projects = [];
    }
    static getInstence() {
        if (this.instence) {
            return this.instence;
        }
        this.instence = new ProjectState();
        return this.instence;
    }
    addListener(listenrFn) {
        this.listener.push(listenrFn);
    }
    addProject(title, description, people) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            descrption: description,
            people: people,
            status: ProjectStatus.active
        };
        this.projects.push(newProject);
        for (const listenerFn of this.listener) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstence();
class ProjectList {
    constructor(type) {
        this.type = type;
        this.assignedProject = [];
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        this.assignedProject = [];
        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectState.addListener((projects) => {
            this.assignedProject = projects;
            this.renderProject();
        });
        this.attache();
        this.renderedContent();
    }
    renderProject() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        for (const prjItem of this.assignedProject) {
            const listItem = document.createElement("li");
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    }
    renderedContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = this.type.toUpperCase() + 'PROJECTS';
    }
    attache() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
class ProjectInputs {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild;
        this.element.id = "user-input";
        this.TitleElementInput = this.element.querySelector("#title");
        this.descriptionElementInput = this.element.querySelector("#description");
        this.peopleElementInput = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    clearInputs() {
        this.TitleElementInput.value = "";
        this.descriptionElementInput.value = "";
        this.peopleElementInput.value = "";
    }
    gatherUsreInputs() {
        const enterdTitle = this.TitleElementInput.value;
        const enterdDescription = this.descriptionElementInput.value;
        const enterdpeople = this.peopleElementInput.value;
        const titleValidatable = {
            value: enterdTitle,
            required: true,
        };
        const descriptionValidatable = {
            value: enterdDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable = {
            value: +enterdpeople,
            required: true,
            min: 2,
            max: 5
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert("wrong");
            return;
        }
        else {
            return [enterdTitle, enterdDescription, +enterdpeople];
        }
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUsreInputs();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = [...userInput];
            projectState.addProject(title, desc, people);
            console.log(userInput);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
const inputProject = new ProjectInputs();
const activeProjectList = new ProjectList("active");
const finichedrojectList = new ProjectList("finished");
