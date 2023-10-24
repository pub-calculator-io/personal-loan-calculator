function calculate(){
	const amount = input.get('loan_amount').gt(0).val();
	const interest = input.get('interest_rate').gt(0).val();
	const years = input.get('loan_term_year').gt(0).val();
	const months = +input.get('loan_term_month').val();
	const startDate = input.get('start_date').optional().date().raw();
	if(!input.valid()) return;

	const totalMonths = years * 12 + months;
	const payment = calculatePayment(amount, totalMonths, interest);
	const schedule = calculateAmortization(amount, totalMonths, interest, startDate);
	const totalInterest = schedule.reduce((total, item) => total + item.paymentToInterest, 0);
	const totalPrincipal = schedule.reduce((total, item) => total + item.paymentToPrinciple, 0);
	const totalPayments = totalPrincipal + totalInterest;
	const payoffDate = schedule[schedule.length-1].date;
	const interestPercent = +(totalInterest / totalPayments * 100).toFixed(0);
	const principalPercent = +(totalPrincipal / totalPayments * 100).toFixed(0);
	const donutData = [principalPercent, interestPercent];
	let chartLegendHtml = '';
	for(let i = 0; i < years; i++){
		chartLegendHtml += `<p class="result-text result-text--small">${i + 1} yr</p>`;
	}
	_('chart__legend').innerHTML = chartLegendHtml;

	let annualResults = [];
	let annualInterest = 0;
	let annualPrincipal = 0;
	let monthlyResultsHtml = '';
	schedule.forEach((item, index) => {
		monthlyResultsHtml += `<tr>
			<td class="text-center">${index + 1}</td>
			<td>${formattedDate(item.date)}</td>
			<td>${currencyFormat(item.paymentToInterest)}</td>
			<td>${currencyFormat(item.paymentToPrinciple)}</td>
			<td>${currencyFormat(item.principle)}</td>
		</tr>`;
		if((index + 1) % 12 === 0 || (index + 1) === schedule.length) {
			let title = 'Year #{1} End'.replace('{1}', Math.ceil((index + 1) / 12).toString());
			monthlyResultsHtml += `<th class="indigo text-center" colspan="5">${title}</th>`;
		}
		annualInterest += item.paymentToInterest;
		annualPrincipal += item.paymentToPrinciple;
		if((index + 1) % 12 === 0 || (index + 1) === schedule.length){
			annualResults.push({
				"date": item.date,
				"interest": item.interest,
				"paymentToInterest": annualInterest,
				"paymentToPrinciple": annualPrincipal,
				"principle": item.principle,
			});
			annualInterest = 0;
			annualPrincipal = 0;
		}
	});
	let annualResultsHtml = '';
	const chartData = [[], [], [], []];
	let prevInterest = 0;
	let prevPrincipal = 0;

	annualResults.forEach((r, index) => {
		annualResultsHtml += `<tr>
			<td class="text-center">${index + 1}</td>
			<td>${formattedDate(r.date)}</td>
			<td>${currencyFormat(r.paymentToInterest)}</td>
			<td>${currencyFormat(r.paymentToPrinciple)}</td>
			<td>${currencyFormat(r.principle)}</td>
	</tr>`;
		prevInterest = r.paymentToInterest + prevInterest;
		prevPrincipal = r.paymentToPrinciple + prevPrincipal;
		chartData[0].push((index + 1));
		chartData[1].push(+r.principle.toFixed(0));
		chartData[2].push(+prevInterest.toFixed(0));
		chartData[3].push(+prevPrincipal.toFixed(0));
	});
	_('monthly-schedule').innerHTML = monthlyResultsHtml;
	_('annual-schedule').innerHTML = annualResultsHtml;
	changeChartData(donutData, chartData);
	output.val('Monthly Payment: $207.58').replace('$207.58', currencyFormat(payment)).set('monthly-payment');
	output.val('Total of 60 Payments: $12,454.80').replace('60', totalMonths).replace('$12,454.80', currencyFormat(totalPayments)).set('total-payments');
	output.val('Total Interest: $2,455.07').replace('$2,455.07', currencyFormat(totalInterest)).set('total-interest');
	output.val('Payoff Date: Dec. 2027').replace('Dec. 2027', formattedDate(payoffDate)).set('payoff-date');
}

function calculatePayment(finAmount, finMonths, finInterest){
	var result = 0;

	if(finInterest == 0){
		result = finAmount / finMonths;
	}
	else{
		var i = ((finInterest/100) / 12),
			i_to_m = Math.pow((i + 1), finMonths),
			p = finAmount * ((i * i_to_m) / (i_to_m - 1));
		result = Math.round(p * 100) / 100;
	}

	return result;
}

function calculateAmortization(finAmount, finMonths, finInterest, finDate){
	var payment = calculatePayment(finAmount, finMonths, finInterest),
		balance = finAmount,
		interest = 0.0,
		totalInterest = 0.0,
		schedule = [],
		currInterest = null,
		currPrinciple = null,
		currDate = (finDate !== undefined && finDate.constructor === Date)? new Date(finDate) : (new Date());

	for(var i=0; i<finMonths; i++){
		currInterest = balance * finInterest/1200;
		totalInterest += currInterest;
		currPrinciple = payment - currInterest;
		balance -= currPrinciple;

		schedule.push({
			principle: balance,
			interest: totalInterest,
			payment: payment,
			paymentToPrinciple: currPrinciple,
			paymentToInterest: currInterest,
			date: new Date(currDate.getTime())
		});

		currDate.setMonth(currDate.getMonth()+1);
	}

	return schedule;
}

function formattedDate(date){
	const monthNames = ["Jan", "Feb", "Marc", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const month = monthNames[date.getMonth()]
	const year = date.getFullYear();
	return month + '. ' + year;
}

function currencyFormat(price){
	return '$' + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
