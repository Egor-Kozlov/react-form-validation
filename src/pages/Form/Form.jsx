import React, { useState, useEffect } from "react";
import ActionsFooter from "../../components/ActionsFooter/ActionsFooter";
import Button from "@mui/material/Button";
import "./Form.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextInput from "../../components/Inputs/TextInput/TextInput";
import Salute from "../../components/Salute/Salute";
import useFormFields from "../../hooks/useFormFields";
import Checkbox from '@mui/material/Checkbox';
import SelectInput from "../../components/Inputs/SelectInput/SelectInput";
import DEFAULT_FORM_DATA from "./defaultFormData";
import validationIPAddress from "../../modules/validationIPAddress";
import replaceEmptyStringsInObjectOnFalse from "../../modules/replaceEmptyStringsInObjectOnFalse";
import Modal from "../../components/Modal/Modal";
import dataToJson from "../../modules/dataToJson";

const NETWORK_NAMES = ['First Internet', 'Second Internet', 'Third Internet'];
const ERROR_MESSAGES = {
    EMPTY_FIELD: 'The field cannot be empty',
    INVALID_VALUE: 'The value is invalid'
}

const Form = () => {
    const [IPAddressOption, setIPAddressOption] = useState("ip-address-automatically")
    const [DNSAddressOption, setDNSAddressOption] = useState("dns-server-address-automatically")
    const [wifiIPAddressOption, setWifiIPAddressOption] = useState("ip-address-automatically");
    const [wifiDNSAddressOption, setWifiDNSAddressOption] = useState('dns-server-address-automatically');

    const [isIPAddressAuto, setIsIPAddressAuto] = useState(true);
    const [isDNSAddressAuto, setIsDNSAddressAuto] = useState(true);

    const [isWifiEnabled, setIsWifiEnabled] = useState(false);
    const [isWifiSecurityEnabled, setIsWifiSecurityEnabled] = useState(false);

    const [IPAddressDirty, setIpAddressDirty] = useState(false);
    const [subnetMaskDirty, setSubnetMaskDirty] = useState(false);
    const [gatewayDirty, setGatewayDirty] = useState(false);
    const [DNSServerDirty, setDNSServerDirty] = useState(false);
    const [alternativeDNSServerDirty, setAlternativeDNSServerDirty] = useState(false);

    const [WifiNameDirty, setWifiNameDirty] = useState(false);
    const [WifiIPAddressDirty, setWifiIPAddressDirty] = useState(false);
    const [WifiSecurityDirty, setWifiSecurityDirty] = useState(false);
    const [WifiSubnetMaskDirty, setWifiSubnetMaskDirty] = useState(false);
    const [WifiGatewayDirty, setWifiGatewayDirty] = useState(false);
    const [WifiDNSServerDirty, setWifiDNSServerDirty] = useState(false);
    const [WifiAlternativeDNSServerDirty, setWifiAlternativeDNSServerDirty] = useState(false);

    const [isShowSalute, setIsShowSalute] = useState(false);
    const [isFormValid, setIsFormValid] = useState(true)
    const [formData, createChangeHandler, clearForm] = useFormFields(DEFAULT_FORM_DATA);

    const prepareFormDataToRequest = (form) => {
        let ipAddress = {
            "IP Address": form.ip_address,
            "Subnet Mask": form.subnet_mask,
            "Gateway": form.default_gateway,
            "DNS Server": form.preferred_dns_server,
            "Alternative DNS Server": form.alt_dns_server
        }
        let wifiSettings = {
            "Enabled": isWifiEnabled,
            "Network Name": form.wifi_network_name,
            "Security key": form.wifi_security_key,
            "IP Address": form.wifi_ip_address,
            "Subnet Mask": form.wifi_subnet_mask,
            "Gateway": form.wifi_default_gateway,
            "DNS Server": form.wifi_preferred_dns_server,
            "Alternative DNS Server": form.wifi_alt_dns_server
        }

        ipAddress = replaceEmptyStringsInObjectOnFalse(ipAddress)
        wifiSettings = replaceEmptyStringsInObjectOnFalse(wifiSettings)

        return { 'IP Address': { ...ipAddress }, 'Wifi Settings': { ...wifiSettings } }
    }

    const submitForm = () => {
        const form = { ...formData }
        if (!validationUntilSubmit(form)) {
            return
        }
        if (!IPAddressDirty && !subnetMaskDirty && !gatewayDirty && !DNSServerDirty &&
            !alternativeDNSServerDirty && !WifiIPAddressDirty && !WifiSubnetMaskDirty &&
            !WifiGatewayDirty && !WifiDNSServerDirty && !WifiAlternativeDNSServerDirty && !WifiSecurityDirty) {
            if (isIPAddressAuto) {
                form.ip_address = 'auto'
                form.subnet_mask = 'auto'
                form.default_gateway = 'auto'
            }
            if (isDNSAddressAuto) {
                form.preferred_dns_server = "auto"
                form.alt_dns_server = "auto"
            }
            if (isWifiEnabled) {
                if (!isWifiSecurityEnabled) {
                    form.wifi_security_key = false
                }
                if (wifiIPAddressOption === 'ip-address-automatically') {
                    form.wifi_ip_address = 'auto'
                    form.wifi_subnet_mask = 'auto'
                    form.wifi_default_gateway = 'auto'
                }
                if (wifiDNSAddressOption === 'dns-server-address-automatically') {
                    form.wifi_preferred_dns_server = "auto"
                    form.wifi_alt_dns_server = "auto"
                }
            }
            console.log(dataToJson(prepareFormDataToRequest(form)));
            setIsShowSalute(true)
        }
    }


    const validationUntilSubmit = (form) => {
        if (IPAddressOption === 'fallowing-ip-address') {
            if (!form.ip_address || !form.subnet_mask) {
                if (!form.ip_address) {
                    setIpAddressDirty(ERROR_MESSAGES.EMPTY_FIELD);
                }
                if (!form.subnet_mask) {
                    setSubnetMaskDirty(ERROR_MESSAGES.EMPTY_FIELD);
                }
                return false
            }
        }
        if (DNSAddressOption === 'use-the-following-DS-server-address') {
            if (!form.preferred_dns_server) {
                setDNSServerDirty(ERROR_MESSAGES.EMPTY_FIELD);
                return false
            }
        }
        if (isWifiEnabled) {
            if (form.wifi_network_name === '') {
                setWifiNameDirty(ERROR_MESSAGES.EMPTY_FIELD);
                return false
            }
            if (isWifiSecurityEnabled) {
                if (!form.wifi_security_key) {
                    setWifiSecurityDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    return false
                }
            }
            if (wifiIPAddressOption === 'fallowing-ip-address') {
                if (!form.wifi_ip_address || !form.wifi_subnet_mask) {
                    if (!form.wifi_ip_address) {
                        setWifiIPAddressDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    }
                    if (!form.wifi_subnet_mask) {
                        setWifiSubnetMaskDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    }
                    return false
                }
            }
            if (wifiDNSAddressOption === 'use-the-following-DNS-server-address') {
                if (!form.wifi_preferred_dns_server) {
                    setWifiDNSServerDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    return false
                }
            }
        }
        return true
    }

    const blurHandler = (event, validation, required) => {
        if (required && (event.target.value === '')) {
            switch (event.target.name) {
                case 'ip_address':
                    setIpAddressDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    break;
                case 'subnet_mask':
                    setSubnetMaskDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    break;
                case 'preferred_dns_server':
                    setDNSServerDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    break;
                case 'wifi_ip_address':
                    setWifiIPAddressDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    break;
                case 'wifi_security_key':
                    setWifiSecurityDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    break;
                case 'wifi_subnet_mask':
                    setWifiSubnetMaskDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    break;
                case 'wifi_preferred_dns_server':
                    setWifiDNSServerDirty(ERROR_MESSAGES.EMPTY_FIELD);
                    break;
                default:
                    break;
            }
        } else if (validation) {
            switch (event.target.name) {
                case 'ip_address':
                    if (validation(event.target.value)) {
                        setIpAddressDirty(false);
                    } else {
                        setIpAddressDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'subnet_mask':
                    if (validation(event.target.value)) {
                        setSubnetMaskDirty(false);
                    } else {
                        setSubnetMaskDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'preferred_dns_server':
                    if (validation(event.target.value)) {
                        setDNSServerDirty(false);
                    } else {
                        setDNSServerDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'alt_dns_server':
                    if (validation(event.target.value)) {
                        setAlternativeDNSServerDirty(false);
                    } else {
                        setAlternativeDNSServerDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'default_gateway':
                    if (validation(event.target.value)) {
                        setGatewayDirty(false);
                    } else {
                        setGatewayDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'wifi_ip_address':
                    if (validation(event.target.value)) {
                        setWifiIPAddressDirty(false);
                    } else {
                        setWifiIPAddressDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'wifi_security_key':
                    setWifiSecurityDirty(false);
                    break;
                case 'wifi_subnet_mask':
                    if (validation(event.target.value)) {
                        setWifiSubnetMaskDirty(false);
                    } else {
                        setWifiSubnetMaskDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'wifi_default_gateway':
                    if (validation(event.target.value)) {
                        setWifiGatewayDirty(false);
                    } else {
                        setWifiGatewayDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'wifi_preferred_dns_server':
                    if (validation(event.target.value)) {
                        setWifiDNSServerDirty(false);
                    } else {
                        setWifiDNSServerDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                case 'wifi_alt_dns_server':
                    if (validation(event.target.value)) {
                        setWifiAlternativeDNSServerDirty(false);
                    } else {
                        setWifiAlternativeDNSServerDirty(ERROR_MESSAGES.INVALID_VALUE);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    useEffect(() => {
        if (IPAddressOption === "fallowing-ip-address") {
            setIsIPAddressAuto(false)
        } else if (IPAddressOption === "ip-address-automatically") {
            setIsIPAddressAuto(true)
        }
    }, [IPAddressOption])

    useEffect(() => {
        if (DNSAddressOption === "use-the-following-DS-server-address") {
            setIsDNSAddressAuto(false)
        } else if (DNSAddressOption === "dns-server-address-automatically") {
            setIsDNSAddressAuto(true)
        }
    }, [DNSAddressOption])

    useEffect(() => {
        if (wifiIPAddressOption === "ip-address-automatically") {
            setIsDNSAddressAuto(false)
        } else if (wifiIPAddressOption === "fallowing-ip-address") {
            setIsDNSAddressAuto(true)
        }
    }, [isWifiEnabled, isWifiSecurityEnabled, wifiIPAddressOption])


    useEffect(() => {
        if (!IPAddressDirty && !subnetMaskDirty && !gatewayDirty && !DNSServerDirty &&
            !alternativeDNSServerDirty && !WifiIPAddressDirty && !WifiSubnetMaskDirty &&
            !WifiGatewayDirty && !WifiDNSServerDirty && !WifiAlternativeDNSServerDirty && !WifiSecurityDirty) {
            setIsFormValid(true)
        } else {
            setIsFormValid(false)
        }
    }, [IPAddressDirty, subnetMaskDirty, gatewayDirty, DNSServerDirty, alternativeDNSServerDirty, WifiIPAddressDirty, WifiSubnetMaskDirty, WifiGatewayDirty, WifiDNSServerDirty, WifiAlternativeDNSServerDirty, WifiSecurityDirty])



    return (
        <>
            {/* <Salute /> */}
            <div className="wrapper">
                <main className="form">
                    <section className="form__section">
                        <FormLabel id="controlled-radio-buttons-group">
                            <h3>Ethernet Settings</h3>
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="controlled-radio-buttons-group"
                            name="radio-buttons-group"
                            defaultValue="ip-address-automatically"
                            onChange={(event) => {
                                setIPAddressOption(event.target.value)
                                setIpAddressDirty(false)
                                setSubnetMaskDirty(false)
                                setGatewayDirty(false)
                            }}
                            value={IPAddressOption}
                        >
                            <FormControlLabel
                                value="ip-address-automatically"
                                control={<Radio />}
                                label="Obtain an IP address automatically (DHCP/BootP)"
                            />
                            <FormControlLabel
                                value="fallowing-ip-address"
                                control={<Radio />}
                                label="Use the fallowing IP address:"
                            />
                        </RadioGroup>
                        <div className="inputs-container">
                            <TextInput
                                label={"IP address:"}
                                disable={IPAddressOption === "ip-address-automatically" ? true : false}
                                required
                                value={formData.ip_address}
                                onChange={createChangeHandler}
                                name="ip_address"
                                onBlurFunc={blurHandler}
                                errorMessage={IPAddressDirty}
                                validation={validationIPAddress}
                            />
                            <TextInput
                                label={"Subnet Mask:"}
                                disable={IPAddressOption === "ip-address-automatically" ? true : false}
                                required
                                value={formData.subnet_mask}
                                onChange={createChangeHandler}
                                name="subnet_mask"
                                onBlurFunc={blurHandler}
                                errorMessage={subnetMaskDirty}
                                validation={validationIPAddress}
                            />
                            <TextInput
                                label={"Default Gateway:"}
                                disable={IPAddressOption === "ip-address-automatically" ? true : false}
                                value={formData.default_gateway}
                                onChange={createChangeHandler}
                                name="default_gateway"
                                onBlurFunc={blurHandler}
                                errorMessage={gatewayDirty}
                                validation={validationIPAddress}
                            />
                        </div>
                        <RadioGroup
                            aria-labelledby="controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            defaultValue="dns-server-address-automatically"
                            onChange={(event) => {
                                setDNSAddressOption(event.target.value)
                                setDNSServerDirty(false)
                                setAlternativeDNSServerDirty(false)
                            }}
                            value={DNSAddressOption}
                        >
                            <FormControlLabel
                                value="dns-server-address-automatically"
                                control={<Radio />}
                                label="Obtain DNS server address automatically"
                            />
                            <FormControlLabel
                                value="use-the-following-DS-server-address"
                                control={<Radio />}
                                label="Use the following DS server address:"
                            />
                            <div className="inputs-container">
                                <TextInput
                                    label={"Preferred DNS server:"}
                                    disable={DNSAddressOption === "dns-server-address-automatically" ? true : false}
                                    required
                                    value={formData.preferred_dns_server}
                                    onChange={createChangeHandler}
                                    name="preferred_dns_server"
                                    onBlurFunc={blurHandler}
                                    errorMessage={DNSServerDirty}
                                    validation={validationIPAddress}
                                />
                                <TextInput
                                    label={"Alternative DNS server:"}
                                    disable={DNSAddressOption === "dns-server-address-automatically" ? true : false}
                                    value={formData.alt_dns_server}
                                    onChange={createChangeHandler}
                                    name="alt_dns_server"
                                    onBlurFunc={blurHandler}
                                    errorMessage={alternativeDNSServerDirty}
                                    validation={validationIPAddress}
                                />
                            </div>
                        </RadioGroup>
                    </section>
                    {/* Second section */}
                    <section className="form__section" style={{ border: "none" }}>
                        <FormLabel id="controlled-radio-buttons-group">
                            <h3>Wireless Settings</h3>
                        </FormLabel>
                        <FormControlLabel control={<Checkbox onChange={(e) => {
                            setIsWifiEnabled(e.target.checked)
                            setWifiIPAddressDirty(false)
                            setWifiSubnetMaskDirty(false)
                            setWifiGatewayDirty(false)
                            setWifiDNSServerDirty(false)
                            setWifiAlternativeDNSServerDirty(false)
                            setWifiSecurityDirty(false)
                            setWifiNameDirty(false)
                        }} />} label="Enable wifi:" />
                        <FormControl disabled={!isWifiEnabled}>
                            <div className="selected-container">
                                <SelectInput
                                    value={formData.wifi_network_name}
                                    disabled={!isWifiEnabled}
                                    label='Wireless Network Name:'
                                    name={'wifi_network_name'}
                                    optionList={NETWORK_NAMES}
                                    required
                                    onChange={createChangeHandler}
                                    onBlurFunc={blurHandler}
                                    errorMessage={WifiNameDirty}
                                    validation={validationIPAddress}
                                />
                            </div>
                            <FormControlLabel control={<Checkbox onChange={(e) => {
                                setIsWifiSecurityEnabled(e.target.checked)
                                setWifiIPAddressDirty(false)
                                setWifiSubnetMaskDirty(false)
                                setWifiGatewayDirty(false)
                                setWifiDNSServerDirty(false)
                                setWifiAlternativeDNSServerDirty(false)
                                setWifiSecurityDirty(false)
                            }} />} label="Enable Wireless Security:" />
                            <div className="inputs-container">
                                <TextInput
                                    label={"Security Key:"}
                                    disable={!(isWifiSecurityEnabled && isWifiEnabled)}
                                    required
                                    value={formData.wifi_security_key}
                                    onChange={createChangeHandler}
                                    name="wifi_security_key"
                                    onBlurFunc={blurHandler}
                                    errorMessage={WifiSecurityDirty}
                                    validation={validationIPAddress}
                                />
                            </div>
                            <FormControl disabled={!isWifiEnabled}>
                                <RadioGroup
                                    aria-labelledby="controlled-radio-buttons-group"
                                    name="radio-buttons-group"
                                    onChange={(event) => {
                                        setWifiIPAddressOption(event.target.value)
                                        setWifiIPAddressDirty(false)
                                        setWifiSubnetMaskDirty(false)
                                        setWifiGatewayDirty(false)
                                    }}
                                    value={wifiIPAddressOption}
                                >
                                    <FormControlLabel
                                        value="ip-address-automatically"
                                        control={<Radio />}
                                        label="Obtain an IP address automatically (DHCP/BootP)"
                                    />
                                    <FormControlLabel
                                        value="fallowing-ip-address"
                                        control={<Radio />}
                                        label="Use the fallowing IP address:"
                                    />
                                </RadioGroup>
                                <FormControl disabled={wifiIPAddressOption === "ip-address-automatically"}>
                                    <div className="inputs-container">
                                        <TextInput
                                            label="IP address:"
                                            disable={!(wifiIPAddressOption === "fallowing-ip-address" && isWifiEnabled)}
                                            required
                                            value={formData.wifi_ip_address}
                                            onChange={createChangeHandler}
                                            name="wifi_ip_address"
                                            onBlurFunc={blurHandler}
                                            errorMessage={WifiIPAddressDirty}
                                            validation={validationIPAddress}
                                        />
                                        <TextInput
                                            label="Subnet Mask:"
                                            disable={!(wifiIPAddressOption === "fallowing-ip-address" && isWifiEnabled)}
                                            required
                                            value={formData.wifi_subnet_mask}
                                            onChange={createChangeHandler}
                                            name="wifi_subnet_mask"
                                            onBlurFunc={blurHandler}
                                            errorMessage={WifiSubnetMaskDirty}
                                            validation={validationIPAddress}
                                        />
                                        <TextInput
                                            label="Default Gateway:"
                                            disable={!(wifiIPAddressOption === "fallowing-ip-address" && isWifiEnabled)}
                                            value={formData.wifi_default_gateway}
                                            onChange={createChangeHandler}
                                            name="wifi_default_gateway"
                                            onBlurFunc={blurHandler}
                                            errorMessage={WifiGatewayDirty}
                                            validation={validationIPAddress}
                                        />
                                    </div>
                                </FormControl>
                                <RadioGroup
                                    aria-labelledby="controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    onChange={(event) => {
                                        setWifiDNSAddressOption(event.target.value)
                                        setWifiDNSServerDirty(false)
                                        setWifiAlternativeDNSServerDirty(false)
                                    }}
                                    value={wifiDNSAddressOption}
                                >
                                    <FormControlLabel
                                        value="dns-server-address-automatically"
                                        control={<Radio />}
                                        label="Obtain DNS server address automatically"
                                    />
                                    <FormControlLabel
                                        value="use-the-following-DNS-server-address"
                                        control={<Radio />}
                                        label="Use the following DNS server address:"
                                    />
                                    <div className="inputs-container">
                                        <TextInput
                                            label="Preferred DNS server:"
                                            disable={!(wifiDNSAddressOption === "use-the-following-DNS-server-address" && isWifiEnabled)}
                                            required
                                            name='wifi_preferred_dns_server'
                                            onChange={createChangeHandler}
                                            value={formData.wifi_preferred_dns_server}
                                            onBlurFunc={blurHandler}
                                            errorMessage={WifiDNSServerDirty}
                                            validation={validationIPAddress}
                                        />
                                        <TextInput
                                            label="Alternative DNS server:"
                                            disable={!(wifiDNSAddressOption === "use-the-following-DNS-server-address" && isWifiEnabled)}
                                            name='wifi_alt_dns_server'
                                            onChange={createChangeHandler}
                                            value={formData.wifi_alt_dns_server}
                                            onBlurFunc={blurHandler}
                                            errorMessage={WifiAlternativeDNSServerDirty}
                                            validation={validationIPAddress}
                                        />
                                    </div>
                                </RadioGroup>
                            </FormControl>
                        </FormControl>
                    </section>
                </main>
            </div>
            <ActionsFooter>
                <div className="wrapper">
                    <div className="buttons-container">
                        <div className="button-container">
                            <Button
                                onClick={() => submitForm()}
                                fullWidth variant="contained"
                                style={{ borderRadius: 50, backgroundColor: "#2ebdff" }}
                                disabled={!isFormValid}
                            >
                                Save
                            </Button>
                        </div>
                        <div className="button-container">
                            <Button
                                fullWidth
                                variant="outlined"
                                style={{ borderRadius: 50, borderColor: "#2ebdff", color: "#2ebdff" }}
                                onClick={clearForm}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </ActionsFooter>
            {isShowSalute && <Modal />}
            {isShowSalute && <Salute />}
        </>
    );
};

export default Form;
