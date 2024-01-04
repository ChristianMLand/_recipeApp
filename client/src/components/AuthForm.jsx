import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = props => {
    const { name, service, fields } = props;
    const initialValues = Object.keys(fields).reduce((prev, field) => ({ ...prev, [field]: "" }), {});
    const [formData, setFormData] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const { error } = await service(formData);
        error ? setFormErrors(error) : navigate("/recipes");
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <fieldset>
                <legend>{name}</legend>
                { Object.entries(fields).map(([name, type], i) => 
                    <div key={i}>
                        <input
                            placeholder={name} 
                            name={name}
                            type={type} 
                            value={formData[name]}
                            onChange={handleChange}
                        />
                        { formErrors[name] && <p className="error">{formErrors[name]}</p> }
                    </div>
                )}
                <button type="submit">{name}</button>
            </fieldset>
        </form>
    )
}

export default AuthForm;