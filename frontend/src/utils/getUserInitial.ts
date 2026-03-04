// fn pour afficher mette la première lettre du nom de famille si pas d'avatar
const getUserInitial = (lastName: string) => {
  return lastName.charAt(0).toUpperCase();
};

export default getUserInitial;
