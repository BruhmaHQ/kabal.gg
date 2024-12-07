import { ConnectButton } from '@rainbow-me/rainbowkit';

const Login = () => {
    return (<>

        <div className="flex p-8  flex-col  gap-6 items-center justify-center"> <img src="./assets/logo.png" className="h-[80px]" height={18} alt="home" />
            <h1 className="font-mono text-3xl font-semibold">kabal.gg</h1>


            <div className=""><ConnectButton /></div>
        </div>

    </>)
}

export default Login;