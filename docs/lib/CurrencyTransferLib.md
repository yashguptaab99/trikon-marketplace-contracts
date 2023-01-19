# CurrencyTransferLib
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)

## Variables <a name="variables"></a>
- `address NATIVE_TOKEN`

## Functions <a name="functions"></a>

### `transferCurrency(address _currency, address _from, address _to, uint256 _amount)` (internal) <a name="currencytransferlib-transfercurrency-address-address-address-uint256-"></a>

**Dev doc**: Transfers a given amount of currency.

### `safeTransferERC20(address _currency, address _from, address _to, uint256 _amount)` (internal) <a name="currencytransferlib-safetransfererc20-address-address-address-uint256-"></a>

**Dev doc**: Transfer `amount` of ERC20 token from `from` to `to`.

### `safeTransferNativeToken(address to, uint256 value)` (internal) <a name="currencytransferlib-safetransfernativetoken-address-uint256-"></a>

**Dev doc**: Transfers `amount` of native token to `to`.
