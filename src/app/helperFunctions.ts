




const { error } = await supabase
.from('companyEvents')
.delete()