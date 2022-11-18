const makeType = (mod) => (type) => `${mod}/${type}`;

const mac = (type,...argNames) => (...args) => {
    const action = { type };
    argNames.forEach((arg,index) => {
        action[argNames[index]] = args[index];
    })
    return action;
}

const createReducer = (IS, handlers) => (state = IS, action) => {
    if(handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state,action)
    } else {
        return state;
    }
}

function getCurrentDate() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let full = null;
    if(month < 10){
        if(day < 10){
            full = `${year}-0${month}-0${day} ${hours}:${minutes}:${seconds}`;
        }
        else {
            full = `${year}-0${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    }else{
        if(day < 10){
            full = `${year}-${month}-0${day} ${hours}:${minutes}:${seconds}`;
        }
        else {
            full = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    }
    return full;
}

function getLastDayMonth() {
    let date = new Date()
    let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    return ultimoDia.getDate();
}

function dayssInmonths(date){
	date = new Date(date);
	return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
}

const diffBetweenDates = (since, until) => {
	//if first date is greater that the first, we fix the order
	if (since > until) {
		var temp = since;
		since = until;
		until = temp;
	}

	var years,months,days;
	
	//Years
	years = (until.getFullYear() - since.getFullYear());
	if (until.getMonth() == since.getMonth()){
		if (since.getDate() < (until.getDate()-1)) {
			years += 1;
		}
		if(since.getDate()==until.getDate()){
				years+= 1;
		}
	}
	if(since.getMonth() > until.getMonth()){
			years = (years - 1);
	}
	//Months
	if(since.getDate() > until.getDate()){
		if(since.getMonth() > (until.getMonth()-1)){
			months = 11 - (since.getMonth() - until.getMonth());
			if (since.getMonth() == until.getMonth()){
				months = 11;
			}
		}else{
			months = until.getMonth() - since.getMonth() - 1;
		}
	}else{
		if(since.getMonth() > until.getMonth()){
			months = 12 - (until.getMonth() - since.getMonth());
		}else{
			months = until.getMonth() - since.getMonth();
		}
	}
	//Days
	if(since.getDate() > (until.getDate()-1)){
		var days_pm = dayssInmonths(until.getMonth(until.getMonth()-1));
		days =  days_pm - since.getDate() + until.getDate();
		if((since.getMonth() == until.getMonth()) & (since.getDate()==until.getDate())){			
			days = 0;
			years = years - 1;
		}
	}else{
		days = until.getDate() - since.getDate();
	}
	
	if(months > 12) {
		years = years + 1;
		months = months - 12;
	}

	return years + ' Años, ' + months + ' meses, ' + days + ' días';
}

const formatDate = (date, language) => {
	const dia = date.substring(0,2)
	const mes = date.substring(3,5)
	const año = date.substring(6,10)
	
	const formatedDate = `${dia} | ${mes === '01' ? language === '1' ? 'Enero' : 'January' : mes === '02' ? language === '1' ? 'Febrero' : 'February' : mes === '03' ? language === '1' ? 'Marzo' : 'March' : mes === '04' ? language === '1' ? 'Abril' : 'April' : mes === '05' ? language === '1' ? 'Mayo' : 'May' : mes === '06' ? language === '1' ? 'Junio' : 'June' : mes === '07' ? language === '1' ? 'Julio' : 'July' : mes === '08' ? language === '1' ? 'Agosto' : 'August' : mes === '09' ? language === '1' ? 'Septiembre' : 'September' : mes === '10' ? language === '1' ? 'Octubre' : 'October' : mes === '11' ? language === '1' ? 'Noviembre' : 'November' : language === '1' ? 'Diciembre' : 'December'} | ${año}`
	return formatedDate
}

const getFullDate = (date) => {
	const dia = date.substring(0,2)
	const mes = date.substring(3,5)
	const año = date.substring(6,10)
	
	const formatedDate = `${año}-${mes}-${dia}`
	return formatedDate
}

export {
    makeType,
    mac,
    createReducer,
    getCurrentDate,
    getLastDayMonth,
    diffBetweenDates,
	formatDate,
	getFullDate
}