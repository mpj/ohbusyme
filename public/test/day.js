define(['/viewmodels/day.js'], function(DayViewModel) {

	describe('DayViewModel', function() {
		describe('date parsing', function() {
			
			it('Parses date to pretty headings', function() {
				var day = new DayViewModel({ date: '2013-12-01' })
				day.heading().should.equal('Dec 1st')
			})

			it('It throws an error if date is not provided', function() {
				(function() {
					new DayViewModel({})
				}).should.throw("Property date was not provided")
			})

		})
	})

})