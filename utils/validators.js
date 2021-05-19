const TreeNode = require("../models/treeNode");

module.exports = {
  isJsonOrArray(obj) {
    if (!obj) return false;
    let opString = JSON.stringify(obj);
    let isArray = opString.charAt(0) === "[" ? true : false;
    let isJson = opString.charAt(0) === "{" ? true : false;
    let result = isArray || isJson;
    return result;
  },

  isArray(obj) {
    if (!obj) return false;
    let opString = JSON.stringify(obj);
    return opString.charAt(0) === "[" ? true : false;
  },

  isJson(obj) {
    if (!obj) return false;
    let opString = JSON.stringify(obj);
    return opString.charAt(0) === "{" ? true : false;
  },

  isNumber(value) {
    if (!value) return false;
    let valueString = value.toString();
    let array = valueString.split("");
    let isNumber = false;
    let n = 0;
    array.map((c) => {
      if (
        c == "0" ||
        c == "1" ||
        c == "2" ||
        c == "3" ||
        c == "4" ||
        c == "5" ||
        c == "6" ||
        c == "7" ||
        c == "8" ||
        c == "9"
      ) {
        n++;
      }
    });
    isNumber = array.length == n;
    return isNumber;
  },

  removeIds(obj) {
    if (this.isJson(obj)) {
      let newChildren = {};
      /** Remove ids */
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let element = obj[key];
          if (this.isNumber(element.value) && element.children.length == 0) {
            // don't add
          } else {
            newChildren[key] = element;
          }
        }
      }
      let result = {};
      /** recursive */
      for (let key in newChildren) {
        if (newChildren.hasOwnProperty(key)) {
          let element = newChildren[key];
          let withoutIds = this.removeIds(element);
          result[key] = withoutIds;
        }
      }
      return result;
    } else if (this.isJson(obj.children)) {
      let newChildren = {};
      /** Remove ids */
      for (let key in obj.children) {
        if (obj.children.hasOwnProperty(key)) {
          let element = obj.children[key];
          if (this.isNumber(element.value) && element.children.length == 0) {
            // don't add
          } else {
            newChildren[key] = element;
          }
        }
      }
      let result = {};
      /** recursive */
      for (let key in newChildren) {
        if (newChildren.hasOwnProperty(key)) {
          let element = newChildren[key];
          let withoutIds = this.removeIds(element);
          result[key] = withoutIds;
        }
      }
      obj.children = result;
      return obj;
    } else if (this.isArray(obj.children)) {
      if (obj.children.length > 0) {
        let newChildren = [];
        obj.children.forEach((element) => {
          if (this.isNumber(element.value) && element.children.length == 0) {
            // don't add
          } else {
            newChildren.push(element);
          }
        });
        let result = [];
        newChildren.forEach((element) => {
          let arrayWithoutIds = this.removeIds(element);
          result.push(arrayWithoutIds);
        });
        obj.children = result;
        return obj;
      }
    } else if (this.isArray(obj)) {
      if (obj.length > 0) {
        let newChildren = [];
        obj.forEach((element) => {
          if (this.isNumber(element.value) && element.children.length == 0) {
            // DON'T ADD
          } else {
            newChildren.push(element);
          }
        });
        let result = [];
        newChildren.forEach((element) => {
          let arrayWithoutIds = this.removeIds(element);
          result.push(arrayWithoutIds);
        });
        return result;
      }
    } else {
      return obj;
    }
  },

  generateJSON(obj) {
    if (typeof obj === 'string' || obj instanceof String) {
        return obj;
    }

    /** Input is a json */
    switch (obj.value) {
      case "array":
        let newObj = [];
        if (this.isArray(obj.children)) {
          obj.children.map((child) => {
            let aux = this.generateJSON(child);
            newObj.push(aux);
          });
        } else if (this.isJson(obj.children)) {
          for (let key in obj.children) {
            if (obj.children.hasOwnProperty(key)) {
              let child = obj.children[key];
              let aux = this.generateJSON(child);
              newObj.push(aux);
            }
          }
        }

        return newObj;
      case "json":
        let newJsonObj = {};
        if (this.isArray(obj.children)) {
          obj.children.map((child) => {
            let aux = this.generateJSON(child);
            newJsonObj[child.value] = aux;
          });
        } else if (this.isJson(obj.children)) {
          for (let key in obj.children) {
            if (obj.children.hasOwnProperty(key)) {
              let child = obj.children[key];
              let aux = this.generateJSON(child);
              newJsonObj[child.value] = aux;
            }
          }
        }

        return newJsonObj;
      default:
        /** If value and children is just string, isn't array */
        if (obj.children) {
          let isArrayOrJson = this.isJsonOrArray(obj.children);
          //return this.generateJSON(obj);
          if(isArrayOrJson){
            return this.generateJSON(obj.children);
          } else {
            let jsonObj = {};
            let key = obj.value.toString();
            let value = obj.children;
            jsonObj[key] = value;
            return value;
          }
        } else {
          /** If only value is an array */
          return obj.value;
        }
    }
  },
  buildOp(op) {
    // array, json
    let opString = JSON.stringify(op);
    let isArray = opString.charAt(0) === "[" ? true : false;
    let isJson = opString.charAt(0) === "{" ? true : false;
  
    if (isArray) {
      let treeNode = new TreeNode("array");
      /** Verify only 1 child */
      op.forEach((item) => {
        let children = this.buildOp(item);
        treeNode.children.push(children);
      });
      return treeNode;
    } else if (isJson) {
      let treeNode = new TreeNode("json");
      for (let key in op) {
        if (op.hasOwnProperty(key)) {
          let obj = op[key];
          let child = new TreeNode(key);
          let isJsonOrArray = this.isJsonOrArray(obj);
          let items = isJsonOrArray ? this.buildOp(obj) : obj;
          child.children = items;
          treeNode.children.push(child);
        }
      }
  
      return treeNode;
    } else {
      // just a value string or number
      return new TreeNode(op);
    }
  }
  
};
