import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Select from 'react-select';
import { useLocation } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import 'react-datepicker/dist/react-datepicker.css';
import CreateCourseSideMenue from '../../components/CreateCourseSideMenue/CreateCourseSideMenue'
import './CreateCoursePricing.css';


const CreateCoursePricing = () => {
    const priceTiersUSD = [
        { value: 10, label: '$10' },
        { value: 20, label: '$20' },
        { value: 30, label: '$30' },
        // Add more tiers as needed
    ];

    const currencyOptions = [
        { value: 'USD', label: 'USD - United States Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound Sterling' },
        { value: 'AUD', label: 'AUD - Australian Dollar' },
        { value: 'CAD', label: 'CAD - Canadian Dollar' },
        { value: 'CHF', label: 'CHF - Swiss Franc' },
        { value: 'CNY', label: 'CNY - Chinese Yuan' },
        { value: 'JPY', label: 'JPY - Japanese Yen' },
        { value: 'INR', label: 'INR - Indian Rupee' },
        { value: 'MXN', label: 'MXN - Mexican Peso' },
        { value: 'NZD', label: 'NZD - New Zealand Dollar' },
        { value: 'RUB', label: 'RUB - Russian Ruble' },
        { value: 'BRL', label: 'BRL - Brazilian Real' },
        { value: 'HKD', label: 'HKD - Hong Kong Dollar' },
        { value: 'SGD', label: 'SGD - Singapore Dollar' },
        { value: 'NOK', label: 'NOK - Norwegian Krone' },
        { value: 'KRW', label: 'KRW - South Korean Won' },
        { value: 'TRY', label: 'TRY - Turkish Lira' },
        { value: 'ZAR', label: 'ZAR - South African Rand' },
        { value: 'SEK', label: 'SEK - Swedish Krona' },
        { value: 'DKK', label: 'DKK - Danish Krone' },
        { value: 'PLN', label: 'PLN - Polish Zloty' },
        { value: 'THB', label: 'THB - Thai Baht' },
        { value: 'IDR', label: 'IDR - Indonesian Rupiah' },
        { value: 'HUF', label: 'HUF - Hungarian Forint' },
        { value: 'CZK', label: 'CZK - Czech Koruna' },
        { value: 'ILS', label: 'ILS - Israeli New Shekel' },
        { value: 'CLP', label: 'CLP - Chilean Peso' },
        { value: 'PHP', label: 'PHP - Philippine Peso' },
        { value: 'AED', label: 'AED - United Arab Emirates Dirham' },
        { value: 'SAR', label: 'SAR - Saudi Riyal' },
        { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
        { value: 'RON', label: 'RON - Romanian Leu' },
        { value: 'ARS', label: 'ARS - Argentine Peso' },
        { value: 'BGN', label: 'BGN - Bulgarian Lev' },
        { value: 'HRK', label: 'HRK - Croatian Kuna' },
        { value: 'EGP', label: 'EGP - Egyptian Pound' },
        { value: 'ISK', label: 'ISK - Icelandic Krona' },
        { value: 'NGN', label: 'NGN - Nigerian Naira' },
        { value: 'PKR', label: 'PKR - Pakistani Rupee' },
        { value: 'QAR', label: 'QAR - Qatari Rial' },
        { value: 'UAH', label: 'UAH - Ukrainian Hryvnia' },
        { value: 'VND', label: 'VND - Vietnamese Dong' },
        { value: 'MAD', label: 'MAD - Moroccan Dirham' },
        { value: 'DZD', label: 'DZD - Algerian Dinar' },
        { value: 'TND', label: 'TND - Tunisian Dinar' },
        { value: 'LBP', label: 'LBP - Lebanese Pound' },
        { value: 'JOD', label: 'JOD - Jordanian Dinar' },
        { value: 'OMR', label: 'OMR - Omani Rial' },
        { value: 'BHD', label: 'BHD - Bahraini Dinar' },
        { value: 'KWD', label: 'KWD - Kuwaiti Dinar' },
        { value: 'BND', label: 'BND - Brunei Dollar' },
        { value: 'FJD', label: 'FJD - Fijian Dollar' },
        { value: 'PGK', label: 'PGK - Papua New Guinean Kina' },
        { value: 'SBD', label: 'SBD - Solomon Islands Dollar' },
        { value: 'TOP', label: 'TOP - Tongan Paʻanga' },
        { value: 'BWP', label: 'BWP - Botswanan Pula' },
        { value: 'GHS', label: 'GHS - Ghanaian Cedi' },
        { value: 'KES', label: 'KES - Kenyan Shilling' },
        { value: 'UGX', label: 'UGX - Ugandan Shilling' },
        { value: 'RWF', label: 'RWF - Rwandan Franc' },
        { value: 'TZS', label: 'TZS - Tanzanian Shilling' },
        { value: 'XOF', label: 'XOF - West African CFA Franc' },
        { value: 'XAF', label: 'XAF - Central African CFA Franc' },
        { value: 'MUR', label: 'MUR - Mauritian Rupee' },
        { value: 'SCR', label: 'SCR - Seychellois Rupee' },
        { value: 'NPR', label: 'NPR - Nepalese Rupee' },
        { value: 'LKR', label: 'LKR - Sri Lankan Rupee' },
        { value: 'MMK', label: 'MMK - Myanmar Kyat' },
        { value: 'BDT', label: 'BDT - Bangladeshi Taka' },
        { value: 'BAM', label: 'BAM - Bosnia and Herzegovina Convertible Mark' },
        { value: 'MKD', label: 'MKD - Macedonian Denar' },
        { value: 'RSD', label: 'RSD - Serbian Dinar' },
        { value: 'MZN', label: 'MZN - Mozambican Metical' },
        { value: 'ANG', label: 'ANG - Netherlands Antillean Guilder' },
        { value: 'AWG', label: 'AWG - Aruban Florin' },
        { value: 'BBD', label: 'BBD - Barbadian Dollar' },
        { value: 'BZD', label: 'BZD - Belize Dollar' },
        { value: 'BMD', label: 'BMD - Bermudian Dollar' },
        { value: 'BOB', label: 'BOB - Bolivian Boliviano' },
        { value: 'BSD', label: 'BSD - Bahamian Dollar' },
        { value: 'BTN', label: 'BTN - Bhutanese Ngultrum' },
        { value: 'BIF', label: 'BIF - Burundian Franc' },
        { value: 'CVE', label: 'CVE - Cape Verdean Escudo' },
        { value: 'KYD', label: 'KYD - Cayman Islands Dollar' },
        { value: 'KMF', label: 'KMF - Comorian Franc' },
        { value: 'CDF', label: 'CDF - Congolese Franc' },
        { value: 'DJF', label: 'DJF - Djiboutian Franc' },
        { value: 'ERN', label: 'ERN - Eritrean Nakfa' },
        { value: 'SZL', label: 'SZL - Eswatini Lilangeni' },
        { value: 'ETB', label: 'ETB - Ethiopian Birr' },
        { value: 'GMD', label: 'GMD - Gambian Dalasi' },
        { value: 'GTQ', label: 'GTQ - Guatemalan Quetzal' },
        { value: 'GNF', label: 'GNF - Guinean Franc' },
        { value: 'GYD', label: 'GYD - Guyanaese Dollar' },
        { value: 'HTG', label: 'HTG - Haitian Gourde' },
        { value: 'HNL', label: 'HNL - Honduran Lempira' },
        { value: 'KZT', label: 'KZT - Kazakhstani Tenge' },
        { value: 'KGS', label: 'KGS - Kyrgystani Som' },
        { value: 'LAK', label: 'LAK - Laotian Kip' },
        { value: 'LRD', label: 'LRD - Liberian Dollar' },
        { value: 'LSL', label: 'LSL - Lesotho Loti' },
        { value: 'LYD', label: 'LYD - Libyan Dinar' },
        { value: 'MOP', label: 'MOP - Macanese Pataca' },
        { value: 'MWK', label: 'MWK - Malawian Kwacha' },
        { value: 'MVR', label: 'MVR - Maldivian Rufiyaa' },
        { value: 'MGA', label: 'MGA - Malagasy Ariary' },
        { value: 'MNT', label: 'MNT - Mongolian Tugrik' },
        { value: 'MDL', label: 'MDL - Moldovan Leu' },
        { value: 'MRO', label: 'MRO - Mauritanian Ouguiya' },
        { value: 'NAD', label: 'NAD - Namibian Dollar' },
        { value: 'NIO', label: 'NIO - Nicaraguan Córdoba' },
        { value: 'PAB', label: 'PAB - Panamanian Balboa' },
        { value: 'PGK', label: 'PGK - Papua New Guinean Kina' },
        { value: 'PYG', label: 'PYG - Paraguayan Guarani' },
        { value: 'SHP', label: 'SHP - Saint Helena Pound' },
        { value: 'WST', label: 'WST - Samoan Tala' },
        { value: 'STD', label: 'STD - São Tomé and Príncipe Dobra' },
        { value: 'SLL', label: 'SLL - Sierra Leonean Leone' },
        { value: 'SYP', label: 'SYP - Syrian Pound' },
        { value: 'SOS', label: 'SOS - Somali Shilling' },
        { value: 'SDG', label: 'SDG - Sudanese Pound' },
        { value: 'SRD', label: 'SRD - Surinamese Dollar' },
        { value: 'TJS', label: 'TJS - Tajikistani Somoni' },
        { value: 'SVC', label: 'SVC - Salvadoran Colón' },
        { value: 'TMT', label: 'TMT - Turkmenistani Manat' },
        { value: 'UZS', label: 'UZS - Uzbekistan Som' },
        { value: 'VUV', label: 'VUV - Vanuatu Vatu' },
        { value: 'XCD', label: 'XCD - East Caribbean Dollar' },
        { value: 'YER', label: 'YER - Yemeni Rial' },
        { value: 'ZMW', label: 'ZMW - Zambian Kwacha' },
        { value: 'ZWL', label: 'ZWL - Zimbabwean Dollar' }
    ];

    const axiosPrivate = useAxiosPrivate()
    const location = useLocation()
    const courseId = location.pathname.split("/")[2];


    const [title,setTitle]=useState()
    const [price, setPrice] = useState(-1)
    const [discount, setDiscount] = useState()
    const [discountStart, setDiscountStart] = useState()
    const [discountEnd, setDiscountEnd] = useState()

    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [priceTiers, setPriceTiers] = useState(priceTiersUSD);
    const [exchangeRates, setExchangeRates] = useState({});

    const [inputAdded, setInputAdded] = useState()

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                setExchangeRates(response.data.rates);
            } catch (error) {
                console.error('Error fetching exchange rates', error);
            }
        };

        fetchExchangeRates();
        console.log(exchangeRates)
    }, [])

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axiosPrivate.get(`/courses/about/${courseId}`);
                setPrice(res.data.price)
                setSelectedCurrency('USD')
                setDiscount(res.data.discount.quantity)
                setDiscountStart(res.data.discount.discountStart)
                setDiscountEnd(res.data.discount.discountEnd)
                setTitle(res.data.title)
            } catch (error) {
                console.log(error)
            }
        };
        getCourse();
        setInputAdded(false)
    }, [inputAdded])

    useEffect(() => {
        if (selectedCurrency && exchangeRates[selectedCurrency]) {
            const newTiers = priceTiersUSD.map(tier => ({
                value: tier.value * exchangeRates[selectedCurrency],
                label: `${(tier.value * exchangeRates[selectedCurrency]).toFixed(2)} ${selectedCurrency}`,
            }));
            setPriceTiers(newTiers);
        }
    }, [selectedCurrency, exchangeRates]);

    const submit = async (e) => {
        try {
            e.preventDefault()
            console.log(selectedCurrency)
            console.log(price)
            if (selectedCurrency !== 'USD') {  
                const response = await axiosPrivate.patch(`/courses/course-pricing/${courseId}`, { price:price / exchangeRates[selectedCurrency],quantity:discount,discountStart,discountEnd})
            }else{
                const response = await axiosPrivate.patch(`/courses/course-pricing/${courseId}`, { price,quantity:discount,discountStart,discountEnd})
            }
            
            setInputAdded(true)
        } catch (error) {
console.log(error)
        }
    }


    return (
        <div className='create-course-main-container'>
            <div className="create-course-navbar">
            <div className="nav-item logo"><CastForEducationIcon className='nav-logo-icon' /> <span className='nav-logo-name'>Educator</span></div>
                <span>Draft course</span>
                <span>{title}</span>
            </div>
            <div className="create-course-container">
                <CreateCourseSideMenue id={courseId}></CreateCourseSideMenue>
                <div className="create-course-left">
                    <div className="create-course-title">Course Pricing</div>
                    <div className="create-course-desc">Your course price is crucial to your success on our platform Educator. As you complete this section, think about putting a price that fit the value earned from your course. Discounts can encourage users to enroll</div>
                    <form className="create-course-inputs" onSubmit={submit}>

                        <div className="create-course-pricing-input">
                            <Select className='price-select'
                                placeholder='Select currency'
                                options={currencyOptions}
                                value={currencyOptions.find(option => option.value === selectedCurrency) || null}
                                onChange={(option) => setSelectedCurrency(option.value)}
                            />
                            <Select className='price-select'
                                placeholder='Select price tier'
                                options={priceTiers}
                                value={priceTiers.find(option => option.value === price) || null}
                                onChange={(option) => setPrice(option.value)}
                            />


                        </div>
                        <div className="create-course-pricing-input">
                            <div>
                                <label>Discount Percentage</label>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                                {/* {errors.quantity && <div style={{ color: 'red' }}>{errors.quantity}</div>} */}
                            </div>
                            <div>
                                <label>Discount Start Date</label>
                                <DatePicker
                                    selected={discountStart}
                                    onChange={(date) => setDiscountStart(date)}
                                    minDate={new Date()}
                                    dateFormat="yyyy-MM-dd"
                                />
                                {/* {errors.discountStart && <div style={{ color: 'red' }}>{errors.discountStart}</div>} */}
                            </div>

                            <div>
                                <label>Discount End Date</label>
                                <DatePicker
                                    selected={discountEnd}
                                    onChange={(date) => setDiscountEnd(date)}
                                    minDate={discountStart}
                                    dateFormat="yyyy-MM-dd"
                                />
                                {/* {errors.discountEnd && <div style={{ color: 'red' }}>{errors.discountEnd}</div>} */}
                            </div>
                        </div>

                        <button className='contin' type='submit' >Save</button>
                    </form>


                </div>
            </div>

        </div>


    )
}

export default CreateCoursePricing