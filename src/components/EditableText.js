import React from 'react';
import PropTypes from "prop-types";

class EditableText extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         editMode: false,
      }
      
      this.inputRef = React.createRef();
   }

   handleClick = () => {
      this.setState({
         editMode: true,
      })
   }

   handleBlur = () => {
      // handle saving here
      if(this.inputRef.current){
         this.props.onSave(this.inputRef.current.name, this.inputRef.current.value);

         // close edit mode
         this.setState({
            editMode: false,
         })
      }
   }

   handleEnterKey = (e) => {
      if (e.keyCode === 13 || e.charCode == 13) {
         this.handleBlur();
      }
   };

   render() {
      const { name, placeholder, children, onSave, ...rest } = this.props;
      const { editMode } = this.state;

      if (editMode) {
         return (
            <input 
               style={{width: "100%", marginBottom: "9px"}}
               ref={this.inputRef} 
               type="text"
               name={name}
               onBlur={this.handleBlur}
               onKeyPress={this.handleEnterKey}
               defaultValue={children}
               autoFocus
            />
         )
      } else {
         let style = {
            height: "30px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
         };

         if(placeholder) style = {...style, color: "#999"};

         return (
            <div
               style={style}
               onClick={this.handleClick}
               {...rest}
            >
               {placeholder ? placeholder : children}
            </div>
         )
      }
   }
}

EditableText.propTypes = {
   name: PropTypes.string.isRequired,
   placeholder: PropTypes.string,
   onSave: PropTypes.func.isRequired
};

export default EditableText;