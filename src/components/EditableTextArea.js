import React from 'react';
import PropTypes from "prop-types";
import TextareaAutosize from 'react-autosize-textarea';
import PerfectScrollbar from "react-perfect-scrollbar";

class EditableTextArea extends React.Component {
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

   render() {
      const { name, placeholder, children, onSave, ...rest } = this.props;
      const { editMode } = this.state;

      const inputStyle = {
         maxHeight: "300px",
         minHeight: "60px",
         resize: "none",
         padding: "5px",
         boxSizing: "border-box"
      };

      if (editMode) {
         return (
            <TextareaAutosize 
               ref={this.inputRef}
               name={name}
               style={inputStyle}
               cols={50}
               rows={3}
               onBlur={this.handleBlur}
               defaultValue={children}
               autoFocus
            />
         )
      } else {
         let style = {
            minHeight: "60px", 
            maxHeight: "300px"
         };
         if(placeholder) style = {...style, color: "#999"};

         return (
            <PerfectScrollbar>
               <div
                  style={style}
                  onClick={this.handleClick}
                  {...rest}
               >
                  {placeholder ? placeholder : children}
               </div>
            </PerfectScrollbar>
         )
      }
   }
}

EditableTextArea.propTypes = {
   name: PropTypes.string.isRequired,
   onSave: PropTypes.func.isRequired
};

export default EditableTextArea;